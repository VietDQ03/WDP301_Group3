import axios from "../config/axiosCustom";

export const login = async (credentials) => {
  try {
    const response = await axios.post("/auth/login", credentials);

    if (response?.data) {
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
    if (response?.data !== undefined) {
      return response.data;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Check OTP API Error:", error);
    throw error;
  }
};

export const sendInvitation = async (invitationData) => {
  try {
    const response = await axios.post("/mail/sendInvitation", invitationData);
    if (response) {
      return response;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.log("Send Invitation API Error:", error);
    throw error;
  }
};