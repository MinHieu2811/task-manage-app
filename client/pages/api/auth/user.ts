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
    return new Promise<void>((resolve, reject) => {
        const pathname = url.parse(req?.url || '')?.pathname
        const isLogin = pathname === '/api/auth/login'
        // Get the `auth-token` cookie:
        const cookies = new Cookies(req, res)
        const authToken = cookies.get('auth-token')

        req.url = req.url?.replace(/^\/api/, 'data')

        // Don't forward cookies to the API:
        req.headers.cookie = ''
        // Set auth-token header from cookie:
        if (authToken) {
            req.headers['authorization'] = `Bearer ${authToken}`
        }
        proxy.once('proxyRes', interceptLoginResponse)
        // Don't forget to handle errors:
        proxy.once('error', reject)
        // Forward the request to the API
        proxy.web(req, res, {
            target: API_URL,
            autoRewrite: false,
            selfHandleResponse: isLogin
        })
        function interceptLoginResponse(proxyRes: any, req: any, res: any) {
            // Read the API's response body from
            // the stream:
            let apiResponseBody = ''
            proxyRes.on('data', (chunk: any) => {
                apiResponseBody += chunk
            })
            proxyRes.on('end', () => {
                try {
                    const { email, username } = JSON.parse(apiResponseBody)
                    res.status(200).json({ email, username })
                    resolve()
                } catch (err) {
                    reject(err)
                }
            })
        }
    })
}