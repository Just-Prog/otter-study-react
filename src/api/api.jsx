import { message } from "antd";
import axios from "axios";
import CryptoJS from 'crypto-js';

import userStore from "@/stores/user";
import nonceGenerator from "@/utils/nonce_generator";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

api.interceptors.request.use(
  config => {
    config.headers["X-AppVer"] = "pc:teaching:pc:3.0-1";
    if(userStore.getState().user.isLogined){
        let nonce = nonceGenerator();
        let timestamp = new Date().getTime();
        let auth = `MAC token="${userStore.getState().user.token}",nonce="${nonce}",timestamp="${timestamp}",mac="${reqMacSigner(config,nonce,timestamp,userStore.getState().user.macKey)}"`
        config.headers["X-Authorization"] = auth;
        config.headers["X-Tenant"] =
          userStore().getState().user.info.tenants[0].tenantId || "";
    }
    return config;
  },
  error => {
    message.error(error.code);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  (error) => {
    message.error(
      error.response.data.message ||
        error.response.statusText ||
        error.message ||
        error.code
    );
    return Promise.reject(error);
  }
);

const reqMacSigner = (config,nonce,ts,mackey) => {
    let method = config.method.toUpperCase();
    let host = "api.goktech.cn";
    let query = new URLSearchParams(config.params);
    query.sort();
    let path = "";
    if(import.meta.env.DEV){
        path = config.url.replace("/api","");
    }else{
        path = config.url;
    }
    if(query !== ""){
        path += `?${query.toString()}`;
    }
    let target = `${method}\n${host}\n${path}\n${nonce}\n${ts}`;
    target = CryptoJS.HmacSHA256(target,mackey);
    target = CryptoJS.enc.Base64.stringify(target)
        .replace(/\+/g, "-")
        .replace(/=/g, "")
        .replace(/\//g, "_");
    return target;
}

export default api;
