import axios from "../../config/axiosCustom";

export const jobApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    if (params.current) queryString.append('current', params.current);
    if (params.pageSize) queryString.append('pageSize', params.pageSize);

    if (params.name) queryString.append('name', params.name);
    if (params.company) queryString.append('company', params.company); // ✅ Thêm công ty
    if (params.location) queryString.append('location', params.location);
    if (params.salary) queryString.append('salary', params.salary); // ✅ Thêm mức lương
    if (params.level) queryString.append('level', params.level);
    if (params.isActive !== undefined && params.isActive !== null) {
      queryString.append('isActive', String(params.isActive));
    }
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
    try {
      const response = await axios.post("/jobs", {
        name: data.name,
        skills: data.skills,
        company: data.company, // Backend đã có company object nên không cần thay đổi
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
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  getOne: async (id) => {
    const response = await axios.get(`/jobs/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    try {
      const response = await axios.patch(`/jobs/${id}`, {
        name: data.name,
        skills: data.skills,
        company: data.company, // Backend đã có company object nên không cần thay đổi
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
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const response = await axios.delete(`/jobs/${id}`);
    return response.data;
  },

  findByCompany: (companyId, params) => {
    const queryString = new URLSearchParams();

    if (params.current) queryString.append('current', params.current);
    if (params.pageSize) queryString.append('pageSize', params.pageSize);

    if (params.name && params.name.trim()) {
      queryString.append('name', params.name.trim());
    }

    if (params.location) {
      queryString.append('location', params.location);
    }

    if (params.level) {
      queryString.append('level', params.level);
    }

    if (params.skills) {
      if (Array.isArray(params.skills)) {
        params.skills.forEach(skill => {
          if (skill) queryString.append('skills', skill);
        });
      } else if (params.skills) {
        queryString.append('skills', params.skills);
      }
    }

    if (params.isActive !== undefined && params.isActive !== null) {
      queryString.append('isActive', String(params.isActive));
    }

    if (params.sort) {
      queryString.append('sort', params.sort);
    }

    return axios.get(`/jobs/by-company/${companyId}?${queryString.toString()}`);
  }
};