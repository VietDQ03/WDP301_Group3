import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

export const login = async (credentials) => {
  const response = await axiosInstance.post("/api/v1/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post("/api/v1/auth/register", userData);
  return response.data;
};