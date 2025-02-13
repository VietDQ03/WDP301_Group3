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
      if (response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue("Không có dữ liệu trả về");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
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
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.role = action.payload.user?.role;
          state.isAuthenticated = true;
          state.error = null;
          if (action.payload.access_token) {
            localStorage.setItem("access_token", action.payload.access_token);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Đã có lỗi xảy ra";
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;