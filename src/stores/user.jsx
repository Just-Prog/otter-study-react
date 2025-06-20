import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import api from "@/api/api.jsx";
import parseJwt from "@/utils/jwt_decode.js";
import CryptoJS from "crypto-js";
import AESDecrypt from "@/utils/aes_decrypt.js";

const userStore = createSlice({
  name: "user",
  reducers: {
    setToken(state, action) {
      state.token = action.payload.token;
      state.macKey = action.payload.macKey;
      state.info = parseJwt(state.token) || {};
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("macKey", action.payload.macKey);
      state.isLogined = state.macKey !== "" && state.token !== "" && JSON.stringify(state.info) !== "{}";
    },
    checkLoginStatus(state) {
      state.isLogined = state.macKey !== "" && state.token !== "" && JSON.stringify(state.info) !== "{}";
    },
    setOSSConfig(state, action) {
        if(state.oss.enableType === "hwyun"){
            let payload = action.payload.hwyunStorageConfigRes;
            const uid = state.info.uid;
            let entry = {
                enableType: "hwyun",
                hwyunStorageConfigRes: {
                    accessKeyId: AESDecrypt(payload.accessKeyId, uid),          // 后端传来的华为云OBS参数由AES算法加密，密钥为用户UID前16位
                    accessKeySecret: AESDecrypt(payload.accessKeySecret, uid),
                    endpoint: AESDecrypt(payload.endpoint, uid),
                    endpointCustom: AESDecrypt(payload.endpointCustom, uid),
                    bucketName: AESDecrypt(payload.bucketName, uid),
                }
            }
            state.oss = entry;
            localStorage.setItem("oss", CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(entry))));
        }else{
            localStorage.setItem("oss", "e30K");
        }
    },
    logout(state) {
      state.isLogined = false;
      state.token = "";
      state.macKey = "";
      state.info = {};
      localStorage.setItem("token", "");
      localStorage.setItem("macKey", "");
    },
  },
  initialState: {
    token: localStorage.getItem("token") || "",
    macKey: localStorage.getItem("macKey") || "",
    info: parseJwt(localStorage.getItem("token")),
    oss: JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(localStorage.getItem("oss") ?? "e30K"))), // base64: e30K => utf8: "{}"
    isLogined: false,
  },
});

const userReducer = userStore.reducer;

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const refreshToken = () => async (dispatch) => {
    let resp = await api.post("/uc/v1/users/refresh-token");
    let token = resp.headers["x-token"];
    let macKey = resp.headers["x-mackey"];
    dispatch(
        setToken({
            token: token,
            macKey: macKey,
        })
    );
};

export const switchTenant = (key) => async (dispatch) => {
    let resp = await api.get("/uc/v1/users/switch-tenant/" + key);
    let token = resp.headers["x-token"];
    let macKey = resp.headers["x-mackey"];
    dispatch(
      setToken({
        token: token,
        macKey: macKey,
      })
    );
    window.location.reload();
}

export const { setToken, checkLoginStatus, setOSSConfig, logout } = userStore.actions;
export default store;
