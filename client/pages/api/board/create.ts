import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from 'http-proxy'
import url from 'url'
import Cookies from "cookies";
export interface ApiStatus {
  success: boolean;
  message: string;
  data?: any;
}

const API_URL = process.env.BE_URL;
const proxy = httpProxy.createProxyServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiStatus>
) {
  if (req.method === "POST") {
    return new Promise<void>((resolve, reject) => {
        const pathname = url.parse(req?.url || "")?.pathname;
        // const isLogin = pathname === "/api/auth/login";
    
        req.url = req.url?.replace(/^\/api/, "data");

        req.headers.cookie = "";
        proxy.once("proxyRes", (proxyRes) => interceptLoginResponse(proxyRes, req, res));

        proxy.once("error", reject);
        proxy.web(req, res, {
          target: API_URL,
          autoRewrite: false,
        //   selfHandleResponse: isLogin,
        });
        function interceptLoginResponse(proxyRes?: any, req?: NextApiRequest, res?: NextApiResponse) {
          let apiResponseBody = "";
          proxyRes.on("data", (chunk: any) => {
            apiResponseBody += chunk;
          });
          proxyRes.on("end", async () => {
            try {
            //   const { access_token, success, message } =
            //     JSON.parse(apiResponseBody)
                
            //     if(req?.session && access_token) {
            //       req.session.token = access_token
            //     }
    
            //     await req?.session.save()
            //   const cookies = new Cookies(req as NextApiRequest, res as NextApiResponse);
            //   cookies.set("auth-token", access_token, {
            //     httpOnly: true,
            //     sameSite: "lax",
            //     maxAge: 8 * 60 * 60 * 1000,
            //   });
            const {data, success, message} = JSON.parse(apiResponseBody)
              res?.status(200).json({ data, success, message });
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }
      });
  }
}
