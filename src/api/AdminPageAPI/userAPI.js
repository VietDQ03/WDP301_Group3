import axios from "../../config/axiosCustom";

export const userApi = {
  getAll: (params) => {
    return axios.get('/users', {
      params: {
        current: params.current || 1,
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

  update: async (_id, updateData) => {
    // Gửi trực tiếp updateData làm request body
    return axios.patch(`/users/${_id}`, updateData);
  },

  delete: async (id) => {
    return axios.delete(`/users/${id}`);
  },

  search: async (params) => {
    const searchParams = {
      current: params.current || 1,
      pageSize: params.pageSize || 10,
      name: params.name || undefined,
      email: params.email || undefined,
      role: params.role || undefined,
      isActived: params.isActived !== undefined ? params.isActived : undefined
    };

    Object.keys(searchParams).forEach(key =>
      searchParams[key] === undefined && delete searchParams[key]
    );

    return axios.get("/users", { params: searchParams });
  },
};