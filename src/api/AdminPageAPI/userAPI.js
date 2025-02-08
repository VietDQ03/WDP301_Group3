// userApi.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const userApi = {
  getAll: (params) => {
    return axiosInstance.get('/users', { 
      params: {
        current: params.page,
        pageSize: params.pageSize
      }
    });
  },

  create: async (data) => {
    const response = await axiosInstance.post("/users", data);
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  search: async (params) => {
    return axiosInstance.get("/users", { 
      params: {
        current: params.page,
        pageSize: params.pageSize,
        ...params
      }
    });
  },
};