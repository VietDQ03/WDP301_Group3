import axios from "../../config/axiosCustom";

export const permissionApi = {
    getAll: (params) => {
        return axios.get('/permissions', { 
          params: {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            name: params.name,
            method: params.method,
            apiPath: params.apiPath,
            module: params.module
          }
        });
  },

  create: async (data) => {
    return axios.post("/permissions", data);
  },

  getOne: async (id) => {
    return axios.get(`/permissions/${id}`);
  },

  update: async (id, data) => {
    return axios.patch(`/permissions/${id}`, data);
  },

  delete: async (id) => {
    return axios.delete(`/permissions/${id}`);
  }
};