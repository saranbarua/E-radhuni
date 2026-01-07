// loginSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const token = Cookies.get("token");

let loggedIn;
if (token) {
  loggedIn = true;
} else {
  loggedIn = false;
}

const initialState = {
  username: "",
  password: "",
  loading: false,
  error: null,
  isLoggedIn: loggedIn,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },

    resetLogin(state) {
      state.username = "";
      state.password = "";
      state.loading = false;
      state.error = null;
      state.isLoggedIn = false;
    },
  },
});

export const {
  setUsername,
  setPassword,
  setLoading,
  setError,
  setLoggedIn,
  isLoggedIn,
  resetLogin,
} = loginSlice.actions;

export default loginSlice.reducer;
