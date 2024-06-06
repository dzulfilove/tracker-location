// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlices";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
