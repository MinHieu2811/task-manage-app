import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../models/index";
import httpProxy from "http-proxy";
import Cookies from 'cookies'
import url from 'url'

interface ActionProps {
  message: string;
  success?: boolean;
}
const API_URL = process.env.BE_URL;
const proxy = httpProxy.createProxyServer()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[] | ActionProps>
) {
  if (req.method === "GET") {
    return new Promise<void>((resolve, reject) => {
      const pathname = url.parse(req?.url || "")?.pathname;
      const isLogin = pathname === "/api/auth/login";

      const cookies = new Cookies(req, res);
      const authToken = cookies.get("auth-token");

      req.url = req.url?.replace(/^\/api/, "data");
      // Set auth-token header from cookie:
      req.headers.cookie = "";
      if (authToken) {
        req.headers['authorization'] = `Bearer ${authToken}`;
      }
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
  }
}
