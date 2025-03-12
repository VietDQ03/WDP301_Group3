import axios from "../config/axiosCustom";

export const positionApi = {
  getAll: (params) => {
    const queryString = new URLSearchParams();

    if (params?.current) queryString.append('current', params.current);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize);

    return axios.get(`/position?${queryString.toString()}`);
  }
};