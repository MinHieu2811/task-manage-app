import httpProxy from 'http-proxy'
import Cookies from 'cookies'
import url from 'url'
import { NextApiRequest, NextApiResponse } from 'next'
// Get the actual API_URL as an environment variable. For real
// applications, you might want to get it from 'next/config' instead.
const API_URL = process.env.BE_URL
const proxy = httpProxy.createProxyServer()

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
    ) {
    // Return a Promise to let Next.js know when we're done
    // processing the request:
    return new Promise<void>((resolve, reject) => {
        // In case the current API request is for logging in,
        // we'll need to intercept the API response.
        // More on that in a bit.
        const pathname = url.parse(req?.url || '')?.pathname
        const isLogin = pathname === '/api/login'
        // Get the `auth-token` cookie:
        const cookies = new Cookies(req, res)
        const authToken = cookies.get('auth-token')
        // Rewrite the URL: strip out the leading '/api'.
        // For example, '/api/login' would become '/login'.
        // ️You might want to adjust this depending
        // on the base path of your API.

        req.url = req.url?.replace(/^\/api/, 'data')

        // Don't forward cookies to the API:
        req.headers.cookie = ''
        // Set auth-token header from cookie:
        if (authToken) {
            req.headers['auth-token'] = authToken
        }
        // In case the request is for login, we need to
        // intercept the API's response. It contains the
        // auth token that we want to strip out and set
        // as an HTTP-only cookie.
        if (isLogin) {
            proxy.once('proxyRes', interceptLoginResponse)
        }
        // Don't forget to handle errors:
        proxy.once('error', reject)
        // Forward the request to the API
        proxy.web(req, res, {
            target: API_URL,
            // Don't autoRewrite because we manually rewrite
            // the URL in the route handler.
            autoRewrite: false,
            // In case we're dealing with a login request,
            // we need to tell http-proxy that we'll handle
            // the client-response ourselves (since we don't
            // want to pass along the auth token).
            selfHandleResponse: isLogin
        })
        function interceptLoginResponse(proxyRes: any, req: any, res: any) {
            // Read the API's response body from
            // the stream:
            let apiResponseBody = ''
            proxyRes.on('data', (chunk: any) => {
                apiResponseBody += chunk
            })
            // Once we've read the entire API
            // response body, we're ready to
            // handle it:
            proxyRes.on('end', () => {
                try {
                    // Extract the authToken from API's response:
                    const { email, username } = JSON.parse(apiResponseBody)
                    // Our response to the client won't contain
                    // the actual authToken. This way the auth token
                    // never gets exposed to the client.
                    res.status(200).json({ email, username })
                    resolve()
                } catch (err) {
                    reject(err)
                }
            })
        }
    })
}