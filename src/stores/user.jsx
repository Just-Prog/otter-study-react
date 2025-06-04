import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import api from "@/api/api.jsx";
import parseJwt from "@/utils/jwt_decode.js";
import { thunk } from "redux-thunk";

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

export const { setToken, checkLoginStatus, logout } = userStore.actions;
export default store;
