// userApi.js
import axios from "../axiosCustom";


export const userApi = {
  getAll: (params) => {
    return axios.get('/users', { 
      params: {
        current: params.page,
        pageSize: params.pageSize
      }
    });
  },

  create: async (data) => {
    const response = await axios.post("/users", data);
    return response;
  },

  getOne: async (id) => {
    const response = await axios.get(`/users/${id}`);
    return response;
  },

  update: async (id, data) => {
    const response = await axios.patch(`/users/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response;
  },

  search: async (params) => {
    return axios.get("/users", { 
      params: {
        current: params.page,
        pageSize: params.pageSize,
        ...params
      }
    });
  },
};