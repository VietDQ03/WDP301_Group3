import axios from "../config/axiosCustom";

export const paymentApi = {
  // Lấy tất cả giao dịch (cho admin)
  getAll: (params) => {
    const { current, pageSize, ...searchParams } = params;
    return axios.get('/payment', {
      params: {
        current,
        pageSize,
        ...searchParams
      }
    });
  },

  // Lấy lịch sử thanh toán theo userId
  findByUserId: (userId, params) => {
    const { current, pageSize, ...searchParams } = params;
    return axios.get(`/payment/user/${userId}`, {
      params: {
        current,
        pageSize,
        ...searchParams
      }
    });
  },

  create: async (data) => {
    const response = await axios.post("/payment/create", {
      amount: data.amount,
      orderType: data.orderType,
      orderInfo: data.orderInfo, 
      language: data.language,
      bankCode: data.bankCode,
      userId: data.userId
    });
    return response.data;
  },

  confirmSuccess: async (params) => {
    return axios.get('/payment/success', {
      params: params
    });
  },

  handleFailed: async (params) => {
    return axios.get('/payment/failed', {
      params: params
    });
  },

  handleVNPayReturn: async (params) => {
    return axios.get('/payment/vnpay-return', {
      params: params
    });
  },

  getPaymentDetail: async (paymentId) => {
    const response = await axios.get(`/payment/${paymentId}`);
    return response.data;
  },

  cancelPayment: async (paymentId) => {
    const response = await axios.post(`/payment/${paymentId}/cancel`);
    return response.data;
  },

  checkPaymentStatus: async (paymentId) => {
    const response = await axios.get(`/payment/${paymentId}/status`);
    return response.data;
  }
};