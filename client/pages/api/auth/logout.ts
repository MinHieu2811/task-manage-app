import httpProxy from "http-proxy";
import Cookies from "cookies";
import url from "url";
import { NextApiRequest, NextApiResponse } from "next";
// Get the actual API_URL as an environment variable. For real
// applications, you might want to get it from 'next/config' instead.
const API_URL = process.env.BE_URL;
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const pathname = url.parse(req?.url || "")?.pathname;
    const isLogin = pathname === "/api/auth/login";
    // Get the `auth-token` cookie:
    const cookies = new Cookies(req, res);
    cookies.set("auth-token", '')
    res.status(200).json({
        message: 'Logout successfully!',
        success: true
    })

    req.url = req.url?.replace(/^\/api/, "data");

    //
    proxy.once("error", reject);

  });
}
