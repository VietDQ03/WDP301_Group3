import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const companyApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/companies");
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/companies", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/companies/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/companies/${id}`);
    return response.data;
  },

  search: async (params) => {
    const response = await axiosInstance.get("/companies", { params });
    return response.data;
  },
};