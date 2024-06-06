// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userEmail: "",
  peran: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userEmail = action.payload.email;
      state.peran = action.payload.peran;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userEmail = "";
      state.peran = "";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
