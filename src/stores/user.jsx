import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const userStore = createSlice({
    name: "user",
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token;
            state.macKey = action.payload.macKey;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('macKey', action.payload.macKey);
            state.isLogined = state.macKey !== "" && state.token !== "";
        },
        checkLoginStatus(state) {
            state.isLogined = state.macKey !== "" && state.token !== "";
        },
        logout(state) {
            state.isLogined = false;
            state.token = "";
            state.macKey = "";
            localStorage.setItem('token', "");
            localStorage.setItem('macKey', "");
        }
    },
    initialState: {
        token: localStorage.getItem("token") || "",
        macKey: localStorage.getItem("macKey") || "",
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