import axios from "../config/axiosCustom";

export const paymentApi = {
  // Tạo giao dịch thanh toán mới
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

  // Xác nhận thanh toán thành công
  confirmSuccess: async (params) => {
    return axios.get('/payment/success', {
      params: params
    });
  },

  // Xử lý thanh toán thất bại
  handleFailed: async (params) => {
    return axios.get('/payment/failed', {
      params: params
    });
  },

  // Xử lý kết quả trả về từ VNPay
  handleVNPayReturn: async (params) => {
    return axios.get('/payment/vnpay-return', {
      params: params // Các params từ VNPay như vnp_ResponseCode, vnp_TransactionStatus,...
    });
  },

  // Lấy lịch sử thanh toán của user 
  getPaymentHistory: async (userId, params) => {
    return axios.get(`/payment/history/${userId}`, {
      params: params
    });
  },

  // Lấy chi tiết 1 giao dịch
  getPaymentDetail: async (paymentId) => {
    const response = await axios.get(`/payment/${paymentId}`);
    return response.data;
  },

  // Lấy danh sách tất cả giao dịch (cho admin)
  getAllPayments: (params) => {
    const { current, pageSize, ...searchParams } = params;
    return axios.get('/payments', {
      params: {
        current,
        pageSize,
        ...searchParams
      }
    });
  },

  // Hủy giao dịch thanh toán
  cancelPayment: async (paymentId) => {
    const response = await axios.post(`/payment/${paymentId}/cancel`);
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentId) => {
    const response = await axios.get(`/payment/${paymentId}/status`);
    return response.data;
  }
};