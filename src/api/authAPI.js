import axios from "./axiosCustom";

export const login = async (credentials) => {
  const response = await axios.post("/api/v1/auth/login", credentials);
  return response;
};

export const register = async (userData) => {
  const response = await axios.post("/api/v1/auth/register", userData);
  return response;
};