import { configureStore, createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import api from "@/api/api.jsx";
import AESDecrypt from "@/utils/aes_decrypt.js";
import parseJwt from "@/utils/jwt_decode.js";

const userStore = createSlice({
  name: "user",
  reducers: {
    setToken(state, action) {
      state.token = action.payload.token;
      state.macKey = action.payload.macKey;
      state.info = parseJwt(state.token) || {};
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("macKey", action.payload.macKey);
      state.isLogined =
        state.macKey !== "" &&
        state.token !== "" &&
        JSON.stringify(state.info) !== "{}";
    },
    checkLoginStatus(state) {
      state.isLogined =
        state.macKey !== "" &&
        state.token !== "" &&
        JSON.stringify(state.info) !== "{}";
    },
    setOSSConfig(state, action) {
      if (state.oss.enableType === "hwyun") {
        const payload = action.payload.hwyunStorageConfigRes;
        const uid = state.info.uid;
        const entry = {
          enableType: "hwyun",
          hwyunStorageConfigRes: {
            accessKeyId: AESDecrypt(payload.accessKeyId, uid), // 后端传来的华为云OBS参数由AES算法加密，密钥为用户UID前16位
            accessKeySecret: AESDecrypt(payload.accessKeySecret, uid),
            endpoint: AESDecrypt(payload.endpoint, uid),
            endpointCustom: AESDecrypt(payload.endpointCustom, uid),
            bucketName: AESDecrypt(payload.bucketName, uid),
          },
        };
        state.oss = entry;
        localStorage.setItem(
          "oss",
          CryptoJS.enc.Base64.stringify(
            CryptoJS.enc.Utf8.parse(JSON.stringify(entry))
          )
        );
      } else {
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
    oss: JSON.parse(
      CryptoJS.enc.Utf8.stringify(
        CryptoJS.enc.Base64.parse(localStorage.getItem("oss") ?? "e30K")
      )
    ), // base64: e30K => utf8: "{}"
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
  const resp = await api.post("/uc/v1/users/refresh-token");
  const token = resp.headers["x-token"];
  const macKey = resp.headers["x-mackey"];
  dispatch(
    setToken({
      token,
      macKey,
    })
  );
};

export const switchTenant = (key) => async (dispatch) => {
  const resp = await api.get("/uc/v1/users/switch-tenant/" + key);
  const token = resp.headers["x-token"];
  const macKey = resp.headers["x-mackey"];
  dispatch(
    setToken({
      token,
      macKey,
    })
  );
  window.location.reload();
};

export const { setToken, checkLoginStatus, setOSSConfig, logout } =
  userStore.actions;
export default store;
