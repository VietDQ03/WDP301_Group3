import axios from "../../config/axiosCustom";

export const resumeApi = {
  getAll: (params) => {
    return axios.get('/resumes', { 
      params: {
        current: params.current || 1,
        pageSize: params.pageSize || 10
      }
    });
  },

  create: async (data) => {
    return axios.post("/resumes", data);
  },

  getResumesByUser: async () => {
    return axios.post("/resumes/by-user");
  },

  getOne: async (id) => {
    return axios.get(`/resumes/${id}`);
  },

  updateStatus: async (id, status) => {
    return axios.patch(`/resumes/${id}`, { status });
  },

  delete: async (id) => {
    return axios.delete(`/resumes/${id}`);
  },

  search: async (params) => {
    return axios.get("/resumes", { 
      params: {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params
      }
    });
  },
};