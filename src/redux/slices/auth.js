import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../api/authAPI";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      // Kiểm tra và trả về data từ response
      if (response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue("Không có dữ liệu trả về");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("access_token");
      window.location.href = '/';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cập nhật state với dữ liệu từ response.data
        if (action.payload) {
          state.user = action.payload.user;
          state.role = action.payload.user?.role;
          state.isAuthenticated = true;
          state.error = null;
          // Lưu token vào localStorage
          if (action.payload.access_token) {
            localStorage.setItem("access_token", action.payload.access_token);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Đã có lỗi xảy ra";
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;