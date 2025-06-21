import express from 'express';
import httpProxyMiddleWare from "http-proxy-middleware";

const app = express();
const port = 5174;
const proxy = httpProxyMiddleWare.createProxyMiddleware;

app.use(
  "/",
  proxy({
    headers: {
      referer: "https://edu.goktech.cn/",
      origin: "https://edu.goktech.cn",
    },
    changeOrigin: true,
    logger: console,
    on: {
      proxyRes: (proxyRes, req, res) => {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      },
    },
    router: (req)=>{
      if(req.path === "?apiversion"){
        return "https://obs.cn-east-2.myhuaweicloud.com";
      }
      return "https://formal-teach.obs.cn-east-2.myhuaweicloud.com";
    }
  })
);

app.listen(port, () => {
  console.log("[HWOBS] ReverseProxy Started");
});