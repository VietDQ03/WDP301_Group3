import axios from "../config/axiosCustom";

export const notificationsApi = {
  getById: (id, params) => {
    const queryString = new URLSearchParams();

    if (params?.current) queryString.append('current', params.current);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize);

    return axios.get(`notifications/${id}?${queryString}`);
  },

  markAsSeen: (id) => {
    return axios.patch(`/notifications/seen/${id}`);
  }
};