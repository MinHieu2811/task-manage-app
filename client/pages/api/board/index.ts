import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../models/index";
import httpProxy from "http-proxy";
import Cookies from "cookies";
import url from "url";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface ActionProps {
  message: string;
  success?: boolean;
}
const API_URL = process.env.BE_URL;
const proxy = httpProxy.createProxyServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[] | ActionProps>
) {
  if (req.method === "GET") {
    return new Promise<void>(async (resolve, reject) => {
      const pathname = url.parse(req?.url || "")?.pathname;
      const isLogin = pathname === "/api/auth/login";

      req.url = req.url?.replace(/^\/api/, "data");
      // Set auth-token header from cookie:
      req.headers.cookie = "";
      if (isLogin) {
        proxy.once("proxyRes", interceptLoginResponse);
      }
      proxy.once("error", reject);
      // Forward the request to the API
      proxy.web(req, res, {
        target: API_URL,
        autoRewrite: false,
      });
      function interceptLoginResponse(proxyRes: any, req: any, res: any) {
        let apiResponseBody = "";
        proxyRes.on("data", (chunk: any) => {
          apiResponseBody += chunk;
        });
        proxyRes.on("end", async () => {
          try {
            const { data, success } = JSON.parse(apiResponseBody);

            if (data && success) {
              return res.status(200).json({ data, success });
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }
    });
  } else if (req.method === "POST") {
    return new Promise<void>((resolve, reject) => {
      const pathname = url.parse(req?.url || "")?.pathname;
      // const isLogin = pathname === "/api/auth/login";

      req.url = req.url?.replace(/^\/api/, "data");
      console.log('run here');

      req.headers.cookie = "";
      proxy.once("proxyRes", (proxyRes) =>
        interceptLoginResponse(proxyRes, req, res)
      );

      proxy.once("error", reject);
      proxy.web(req, res, {
        target: API_URL,
        autoRewrite: false,
        //   selfHandleResponse: isLogin,
      });
      function interceptLoginResponse(
        proxyRes?: any,
        req?: NextApiRequest,
        res?: NextApiResponse
      ) {
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
            const { data, success, message } = JSON.parse(apiResponseBody);
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
