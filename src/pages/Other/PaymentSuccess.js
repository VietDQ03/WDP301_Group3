import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home } from 'lucide-react';
import dayjs from "dayjs";
import { paymentApi } from "../../api/paymentAPI";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const handlePayment = async () => {
      try {
        // Kiểm tra trạng thái trực tiếp từ URL params
        const responseCode = queryParams.get("vnp_ResponseCode");
        const transactionStatus = queryParams.get("vnp_TransactionStatus");

        if (responseCode === "00" && transactionStatus === "00") {
          setPaymentData({
            orderId: queryParams.get("vnp_TxnRef"),
            status: "success",
            message: "Giao dịch thành công"
          });
        } else {
          setPaymentData({
            orderId: queryParams.get("vnp_TxnRef"),
            status: "failed",
            message: "Giao dịch thất bại"
          });
        }

        // Gọi API để lưu thông tin giao dịch
        await paymentApi.handleVNPayReturn({
          vnp_Amount: queryParams.get("vnp_Amount"),
          vnp_BankCode: queryParams.get("vnp_BankCode"),
          vnp_BankTranNo: queryParams.get("vnp_BankTranNo"),
          vnp_CardType: queryParams.get("vnp_CardType"),
          vnp_OrderInfo: queryParams.get("vnp_OrderInfo"),
          vnp_PayDate: queryParams.get("vnp_PayDate"),
          vnp_ResponseCode: responseCode,
          vnp_TmnCode: queryParams.get("vnp_TmnCode"),
          vnp_TransactionNo: queryParams.get("vnp_TransactionNo"),
          vnp_TransactionStatus: transactionStatus,
          vnp_TxnRef: queryParams.get("vnp_TxnRef"),
          vnp_SecureHash: queryParams.get("vnp_SecureHash")
        });

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        // Vẫn hiển thị kết quả dựa trên URL params ngay cả khi API lỗi
        const responseCode = queryParams.get("vnp_ResponseCode");
        const transactionStatus = queryParams.get("vnp_TransactionStatus");
        
        setPaymentData({
          orderId: queryParams.get("vnp_TxnRef"),
          status: responseCode === "00" && transactionStatus === "00" ? "success" : "failed",
          message: responseCode === "00" && transactionStatus === "00" 
            ? "Giao dịch thành công" 
            : "Giao dịch thất bại"
        });
        setLoading(false);
      }
    };

    handlePayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isTransactionSuccessful = paymentData?.status === "success";
  const formattedDate = queryParams.get("vnp_PayDate") 
    ? dayjs(queryParams.get("vnp_PayDate"), "YYYYMMDDHHmmss").format("HH:mm:ss DD/MM/YYYY")
    : "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Thông Tin Thanh Toán Đơn Hàng {paymentData?.orderId}
          </h2>

          <div className="mb-8">
            {isTransactionSuccessful ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            )}
            <p className="mt-4 text-lg font-semibold text-gray-900">
              {paymentData?.message}
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Số tiền:</span>
              <span className="text-gray-900">
                {(parseInt(queryParams.get("vnp_Amount")) / 100).toLocaleString()} VNĐ
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Ngân hàng:</span>
              <span className="text-gray-900">{queryParams.get("vnp_BankCode")}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Nội dung thanh toán:</span>
              <span className="text-gray-900">{queryParams.get("vnp_OrderInfo")}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Thời gian thanh toán:</span>
              <span className="text-gray-900">{formattedDate}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Mã giao dịch:</span>
              <span className="text-gray-900">{queryParams.get("vnp_TransactionNo")}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Mã đơn hàng:</span>
              <span className="text-gray-900">{paymentData?.orderId}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            <span>Về trang quản lý</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;