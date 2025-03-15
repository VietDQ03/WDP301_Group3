import axios from "../config/axiosCustom";

export const skillApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    if (params?.current) queryString.append('current', params.current);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize);

    return axios.get(`/skills?${queryString.toString()}`);
  }
};