import { createSlice } from "@reduxjs/toolkit";
import { login } from "../../actions/authActions";
import { logout } from "../../actions/authActions";
import { LOCAL_STORAGE } from "../../../app/constants";

const initialState = {
  user: localStorage.getItem(LOCAL_STORAGE?.USER)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER))
    : null,  // Will fall back to null if USER is not in localStorage
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          LOCAL_STORAGE.USER,
          JSON.stringify(action.payload)
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem(LOCAL_STORAGE.USER);
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
