import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://54.252.173.49:8000/api/v1",
});

export const jobApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    // Add pagination params
    if (params.current) queryString.append('current', params.current);
    if (params.pageSize) queryString.append('pageSize', params.pageSize);

    // Add search filters
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

    // Add sorting
    if (params.sort) queryString.append('sort', params.sort);

    return axiosInstance.get(`/jobs?${queryString.toString()}`);
  },

  create: async (data) => {
    const response = await axiosInstance.post("/jobs", {
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
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  }
};