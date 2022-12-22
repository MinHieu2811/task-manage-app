import type { NextApiRequest, NextApiResponse } from "next";
import { SectionData } from "../../../models/index";
import url from "url";
import Cookies from "cookies";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer();
const API_URL = process?.env?.BE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SectionData[]>
) {
  return new Promise<void>((resolve, reject) => {
    const pathname = url.parse(req?.url || "")?.pathname;
    const isLogin = pathname === "/api/auth/login";
    // Get the `auth-token` cookie:
    const cookies = new Cookies(req, res);
    const authToken = cookies.get("auth-token");

    req.url = req.url?.replace(/^\/api/, "data");
    req.headers.cookie = "";
    if (authToken) {
      req.headers["authorization"] = `Bearer ${authToken}`;
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
      // Read the API's response body from
      // the stream:
      let apiResponseBody = "";
      proxyRes.on("data", (chunk: any) => {
        apiResponseBody += chunk;
      });
      proxyRes.on("end", async () => {
        try {
          // Extract the authToken from API's response:
          const { data, success } = JSON.parse(apiResponseBody);

          res.status(200).json({ success, data });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }
  });
}
