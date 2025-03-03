import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, getUserProfile } from "../../api/authAPI";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
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

// 🆕 Thêm checkAuth để kiểm tra đăng nhập khi load trang
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return thunkAPI.rejectWithValue("Không có token");
      }
      const response = await getUserProfile(token); // Gọi API lấy user từ token
      if (response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue("Token không hợp lệ");
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
      // window.location.href = '/';
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
      })
      // 🆕 Xử lý checkAuth khi load trang
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        // Kiểm tra và lấy data từ response
        const userData = action.payload.data?.user || action.payload.data;
        if (userData) {
          state.user = userData;
          state.role = userData.role;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem("access_token"); 
      });
  },
});

export const { logout, updateUser  } = authSlice.actions;

export default authSlice.reducer;