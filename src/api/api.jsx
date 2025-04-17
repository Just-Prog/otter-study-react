import Axios from "axios";

const api = Axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers["X-AppVer"] = "pc:teaching:pc:3.0-1";
  return config;
});

api.interceptors.response.use((config) => {
  console.log(config);
  return config;
});

export default api;
