import { createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../../config/apiFunctions";
import { AUTH } from "../../config/endPoints";
import { toast } from "react-toastify";
import { LOCAL_STORAGE } from "../../app/constants";
// localStorage.clear();

export const login = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await postRequest(AUTH.LOGIN, { email, password });
      if (response?.data?.success && response?.data?.statusCode === 200) {
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        
        localStorage.setItem(
          LOCAL_STORAGE.ACCESS_TOKEN,
          response?.data?.data?.token
        );
        
        // localStorage.setItem(
        //   LOCAL_STORAGE.PROFILE_PICTURE,
        //   response?.data?.data?.profile_picture
        // );
        localStorage.setItem(
          LOCAL_STORAGE.USER,
          JSON.stringify(response?.data?.data)
        );
        return response?.data?.data;
      }
    } catch (error) {
      toast.error(error?.response?.data?.error, {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest(AUTH.LOGOUT, {});
      const status = response?.status;

      if (status === 200) {
        // Clear localStorage
        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE.PROFILE_PICTURE);
        localStorage.removeItem(LOCAL_STORAGE.USER);

        toast.success("Logout successful", {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });

        return true;
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      toast.error("Logout failed", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });

      if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
        return rejectWithValue("Network error. Please try again.");
      }

      const status = error?.response?.status;
      if (status === 401) { 
        return rejectWithValue("Unauthorized logout.");
      } else if (status === 405) {
        return rejectWithValue("Logout method not allowed.");
      } else {
        return rejectWithValue("Logout failed.");
      }
    }
  }
);
