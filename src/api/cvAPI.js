import axios from "../config/axiosCustom";

export const cvAPI = {
  create: async (data) => {
    try {
      const response = await axios.post("/cv", {
        url: data.url,
        position: data.position,
        skill: data.skill,
        experience: data.experience,
        isActive: data.isActive,
        description: data.description
      });
      return response.data;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.patch(`/cv`, {
        url: data.url,
        position: data.position,
        skill: data.skill,
        experience: data.experience,
        isActive: data.isActive,
        description: data.description
      });
      return response.data;
    } catch (error) {
      console.error('Error updating CV:', error);
      throw error;
    }
  },

  findAllByUserId: async (id) => {
    try {
      const response = await axios.get(`/cv/findByUserId/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CV:', error);
      throw error;
    }
  },

  getAll: (params) => {
    return axios.get('/cv/findAllIsActive', {
      params: {
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        ...(params.position && { position: params.position }),
        ...(params.skill && { skill: params.skill }),
        ...(params.experience && { experience: params.experience })
      }
    });
  }
};