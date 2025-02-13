import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../api/authAPI";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await login(credentials);
      console.log("Login API Response:", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const data = await register(userData);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false, // 🆕 Thêm isAuthenticated vào state
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login Fulfilled Payload:", action.payload);
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.role = action.payload.data.user.role;
        state.isAuthenticated = true; // 🆕 Đánh dấu người dùng đã đăng nhập
        localStorage.setItem("access_token", action.payload.data.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // 🆕 Đảm bảo khi login thất bại, trạng thái là false
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true; // 🆕 Cập nhật trạng thái đăng nhập
        localStorage.setItem("access_token", action.payload.data.access_token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // 🆕 Đảm bảo khi đăng ký thất bại, trạng thái là false
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;