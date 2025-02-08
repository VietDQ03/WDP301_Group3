import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const jobApi = {
  getAll: (params) => {
    return axiosInstance.get('/jobs', { 
      params: {
        current: params.page,
        pageSize: params.pageSize,
      }
    });
  },

  create: async (data) => {
    const response = await axiosInstance.post("/jobs", data);
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  }
};