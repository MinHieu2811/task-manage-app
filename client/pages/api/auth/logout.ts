import httpProxy from "http-proxy";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
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
    const cookies = new Cookies(req, res);
    cookies.set("auth-token", '')
    res.status(200).json({
        message: 'Logout successfully!',
        success: true
    })

    req.url = req.url?.replace(/^\/api/, "data");

    //
    proxy.once("error", reject);
    resolve()
  });
}
