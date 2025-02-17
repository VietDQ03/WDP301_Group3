
import axios from "../axiosCustom";

export const jobApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    if (params.current) queryString.append('current', params.current);
    if (params.pageSize) queryString.append('pageSize', params.pageSize);

    if (params.name) queryString.append('name', params.name);
    if (params.location) queryString.append('location', params.location);
    if (params.level) queryString.append('level', params.level);
    if (params.skills) {
      if (Array.isArray(params.skills)) {
        params.skills.forEach(skill => queryString.append('skills', skill));
      } else {
        queryString.append('skills', params.skills);
      }
    }

    if (params.sort) queryString.append('sort', params.sort);

    return axios.get(`/jobs?${queryString.toString()}`);
  },

  create: async (data) => {
    const response = await axios.post("/jobs", {
      name: data.name,
      skills: data.skills,
      company: data.company,
      salary: data.salary,
      quantity: data.quantity,
      level: data.level,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      location: data.location
    });
    return response.data;
  },

  getOne: async (id) => {
    const response = await axios.get(`/jobs/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.patch(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/jobs/${id}`);
    return response.data;
  }
};