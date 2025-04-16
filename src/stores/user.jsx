import {createSlice} from "@reduxjs/toolkit";

const userStore = createSlice({
    name: "user",
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token;
            state.macKey = action.payload.macKey;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('macKey', action.payload.macKey);
        },
    },
    initialState: {
        token: localStorage.getItem("token") || "",
        macKey: localStorage.getItem("macKey") || "",
    }
});

const { setToken } = userStore.actions
const userReducer = userStore.reducer;

const refreshToken = function(){
    
}

export { setToken };

export default userReducer;