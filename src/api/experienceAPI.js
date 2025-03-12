import axios from "../config/axiosCustom";

export const experienceApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    if (params?.current) queryString.append('current', params.current);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize);

    return axios.get(`/experience?${queryString.toString()}`);
  }
};