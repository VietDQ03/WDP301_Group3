import axios from "../config/axiosCustom";

export const login = async (credentials) => {
  try {
    const response = await axios.post("/auth/login", credentials);

    if (response?.data) {
      console.log("Login API Response:", response.data.user?.isDeleted);
      if (response.data.user?.isDeleted) {
        throw new Error("Tài khoản của bạn đã bị vô hiệu hóa.");
      }
      return response;
    }
    
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Login API Error:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post("/auth/register", userData);
    console.log("Register API Response:", response);
    if (response?.data) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Register API Error:", error);
    throw error;
  }
};

export const getUserProfile = (token) =>
  axios.get("/auth/account", {
    headers: { Authorization: `Bearer ${token}` },
  });