import axios from "../axiosCustom";

export const userApi = {
  getAll: (params) => {
    return axios.get('/users', { 
      params: {
        current: params.current || 1,  // sửa page thành current cho đúng với BE
        pageSize: params.pageSize || 10
      }
    });
  },

  create: async (data) => {
    return axios.post("/users", data);
  },

  getOne: async (id) => {
    return axios.get(`/users/${id}`);
  },

  update: async (id, data) => {
    return axios.patch(`/users/${id}`, data);
  },

  delete: async (id) => {
    return axios.delete(`/users/${id}`);
  },

  search: async (params) => {
    return axios.get("/users", { 
      params: {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params
      }
    });
  },
};