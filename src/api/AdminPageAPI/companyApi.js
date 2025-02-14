import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const companyApi = {
  getAll: (params) => {
    return axiosInstance.get('/companies', { 
      params: params 
    });
  },

  create: async (data) => {
    const response = await axiosInstance.post("/companies", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/companies/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/companies/${id}`);
    return response.data;
  },

  findOne: async (id) => {
    const response = await axiosInstance.get(`/companies/${id}`);
    return response.data;
  },

  search: (params) => {
    const { current, pageSize, ...searchParams } = params;
    return axiosInstance.get('/companies', { 
      params: {
        current,
        pageSize,
        ...searchParams // For search parameters like name, address
      }
    });
  }
};