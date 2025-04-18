import { message } from "antd";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

api.interceptors.request.use(
  config => {
    config.headers["X-AppVer"] = "pc:teaching:pc:3.0-1";
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

export default api;
