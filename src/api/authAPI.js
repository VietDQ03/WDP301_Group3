import axios from "./axiosCustom";

export const login = async (credentials) => {
  try {
    const response = await axios.post("/auth/login", credentials);
    console.log("Login API Response:", response);
    // API trả về response với cấu trúc {statusCode, message, data}
    if (response?.data) {
      return response; // Trả về toàn bộ response để xử lý ở slice
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
    return response;
  } catch (error) {
    throw error;
  }
};