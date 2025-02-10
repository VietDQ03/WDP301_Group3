import axios from "./axiosCustom";

export const login = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  return response;
};

export const register = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response;
};