import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const companyApi = {
  getAll: (params) => {
    return axiosInstance.get('/companies', { 
      params: {
        current: params.page,   
        pageSize: params.pageSize
      }
    });
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
    return axiosInstance.get("/companies", { 
      params: {
        current: params.page,    // Đổi thành current
        pageSize: params.pageSize,
        ...params
      }
    });
  },

  // Thêm method findOne
  findOne: async (id) => {
    const response = await axiosInstance.get(`/companies/${id}`);
    return response.data;
  },
};