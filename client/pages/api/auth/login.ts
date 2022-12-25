import httpProxy from "http-proxy";
import Cookies from "cookies";
import url from "url";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from "@/utils/sessions";
// Get the actual API_URL as an environment variable. For real
// applications, you might want to get it from 'next/config' instead.
const API_URL = process.env.BE_URL;
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Return a Promise to let Next.js know when we're done
  // processing the request:
  return new Promise<void>((resolve, reject) => {
    const pathname = url.parse(req?.url || "")?.pathname;
    const isLogin = pathname === "/api/auth/login";

    req.url = req.url?.replace(/^\/api/, "data");

    // Don't forward cookies to the API:
    req.headers.cookie = "";
    if (isLogin) {
      proxy.once("proxyRes", (proxyRes) => interceptLoginResponse(proxyRes, req, res));
    }
    // Don't forget to handle errors:
    proxy.once("error", reject);
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
      selfHandleResponse: isLogin,
    });
    function interceptLoginResponse(proxyRes?: any, req?: NextApiRequest, res?: NextApiResponse) {
      // Read the API's response body from
      // the stream:
      let apiResponseBody = "";
      proxyRes.on("data", (chunk: any) => {
        apiResponseBody += chunk;
      });
      // Once we've read the entire API
      // response body, we're ready to
      // handle it:
      proxyRes.on("end", async () => {
        try {
          // Extract the authToken from API's response:
          const { access_token, success, message } =
            JSON.parse(apiResponseBody)
            
            if(req?.session && access_token) {
              req.session.token = access_token
            }

            await req?.session.save()
          // Set the authToken as an HTTP-only cookie.
          // We'll also set the SameSite attribute to
          // 'lax' for some additional CSRF protection.
          const cookies = new Cookies(req as NextApiRequest, res as NextApiResponse);
          cookies.set("auth-token", access_token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
          });
          // Our response to the client won't contain
          // the actual authToken. This way the auth token
          // never gets exposed to the client.
          res?.status(200).json({ success, message });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }
  });
}

export default withIronSessionApiRoute(handler, sessionOptions)