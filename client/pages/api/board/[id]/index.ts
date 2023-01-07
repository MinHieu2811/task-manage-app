import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../../models/index";
import axios from "axios";
import url from 'url'
import Cookies from "cookies";
import httpProxy from "http-proxy";

interface ActionProps {
  message: string
  success?: boolean
}

const proxy = httpProxy.createProxyServer();
const API_URL = process.env.BE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[] | ActionProps>
) {
  if (req.method === "GET") {
    return new Promise<void>((resolve, reject) => {
      const pathname = url.parse(req?.url || "")?.pathname;
      const isLogin = pathname === "/api/auth/login";
  
      req.url = req.url?.replace(/^\/api/, "data");
      req.headers.cookie = "";

      if(isLogin) {
        proxy.once("proxyRes", (proxyRes) => interceptLoginResponse(proxyRes, req, res));
      }

      proxy.once("error", reject);
      // Forward the request to the API
      proxy.web(req, res, {
        target: API_URL,
        autoRewrite: false,
      });
      function interceptLoginResponse(proxyRes: any, req: any, res: any) {
        // Read the API's response body from
        // the stream:
        let apiResponseBody = "";
        proxyRes.on("data", (chunk: any) => {
          apiResponseBody += chunk;
        });
        proxyRes.on("end", async () => {
          try {
            // Extract the authToken from API's response:
            const { data, success } =
              JSON.parse(apiResponseBody);

            res.status(200).json({ success, data });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }
    });
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      res.status(200).json({
        message: "Delete successfully!",
        success: true,
      });
    } catch (error) {
      res.status(404).json({
        message: "Delete failed!",
        success: false,
      });
    }
  }
}
