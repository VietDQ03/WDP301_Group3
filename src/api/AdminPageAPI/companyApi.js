
import axios from "../axiosCustom";

export const companyApi = {
  getAll: (params) => {
    return axios.get('/companies', { 
      params: params 
    });
  },

  create: async (data) => {
    const response = await axios.post("/companies", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.patch(`/companies/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/companies/${id}`);
    return response.data;
  },

  findOne: async (id) => {
    const response = await axios.get(`/companies/${id}`);
    return response.data;
  },

  search: (params) => {
    const { current, pageSize, ...searchParams } = params;
    return axios.get('/companies', { 
      params: {
        current,
        pageSize,
        ...searchParams // For search parameters like name, address
      }
    });
  }
};