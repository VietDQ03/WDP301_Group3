import axios from "../config/axiosCustom";

export const login = async (credentials) => {
  try {
    const response = await axios.post("/auth/login", credentials);
    console.log("Login API Response:", response);
    if (response?.data) {
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

export const changePassword = async (data) => {
  try {
    const response = await axios.post("/auth/change-password", data);
    console.log("Change Password API Response:", response);
    if (response?.data) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Change Password API Error:", error);
    throw error;
  }
};

export const forgetPassword = async (data) => {
  try {
    const response = await axios.post("/auth/forget", data);
    console.log("Forget Password API Response:", response);
    if (response?.data) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Forget Password API Error:", error);
    throw error;
  }
};

export const sendOTP = async (email) => {
  try {
    const response = await axios.post("/mail/sendOTP", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendJobNotifications = async () => {
  try {
    const response = await axios.get("/mail/SendJob");
    console.log("Send Job Notifications API Response:", response);
    if (response?.data) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Send Job Notifications API Error:", error);
    throw error;
  }
};

export const sendResumeResult = async (sendResultDto) => {
  try {
    const response = await axios.post("/mail/sendResult", sendResultDto);
    console.log("Send Resume Result API Response:", response);
    if (response?.data) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Send Resume Result API Error:", error);
    throw error;
  }
};

export const checkOTP = async (email, otp) => {
  try {
    const response = await axios.post("/verification/checkOtp", { email, otp });
    console.log("Check OTP API Response:", response);
    if (response?.data !== undefined) {
      return response.data;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Check OTP API Error:", error);
    throw error;
  }
};