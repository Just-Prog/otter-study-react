import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import api from "@/api/api.jsx";
import parseJwt from "@/utils/jwt_decode.js";

const userStore = createSlice({
    name: "user",
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token;
            state.macKey = action.payload.macKey;
            state.info = parseJwt(state.token) || {};
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('macKey', action.payload.macKey);
            state.isLogined = state.macKey !== "" && state.token !== "";
            console.log(state.info)
        },
        refreshToken(state){
            if(state.isLogined) {
                api.post("/uc/v1/users/refresh-token").then((resp) => {
                    let token = resp.header['x-token']
                    let macKey = resp.header['x-mackey']
                    state.token = token;
                    state.macKey = macKey;
                    state.info = parseJwt(token) || {};
                    localStorage.setItem('token', token);
                    localStorage.setItem('macKey', macKey);
                    state.isLogined = state.macKey !== "" && state.token !== "";
                })
            }
        },
        checkLoginStatus(state) {
            state.isLogined = state.macKey !== "" && state.token !== "";
        },
        logout(state) {
            state.isLogined = false;
            state.token = "";
            state.macKey = "";
            state.info = {};
            localStorage.setItem('token', "");
            localStorage.setItem('macKey', "");
        }
    },
    initialState: {
        token: localStorage.getItem("token") || "",
        macKey: localStorage.getItem("macKey") || "",
        info: parseJwt(localStorage.getItem("token")),
        isLogined: false,
    }
});

const { setToken, checkLoginStatus, logout } = userStore.actions
const userReducer = userStore.reducer;

const store = configureStore({
    reducer: {
        user: userReducer
    }
});
export { setToken, checkLoginStatus, logout };
export default store;