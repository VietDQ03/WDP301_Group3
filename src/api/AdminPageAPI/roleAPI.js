import axios from "../axiosCustom";

export const roleApi = {
  getAll: (params) => {
    return axios.get('/roles', { 
      params: {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params
      }
    });
  },

  create: async (data) => {
    return axios.post("/roles", data);
  },

  getOne: async (id) => {
    return axios.get(`/roles/${id}`);
  },

  update: async (id, data) => {
    return axios.patch(`/roles/${id}`, data);
  },

  delete: async (id) => {
    return axios.delete(`/roles/${id}`);
  }
};