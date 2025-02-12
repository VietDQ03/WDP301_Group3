import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlan = location.state || {
        planName: 'Cơ Bản',
        planPrice: '499.000',
        planPeriod: '/tháng',
        planFeatures: []
    };

    const [isCompleted, setIsCompleted] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleComplete = () => {
        setIsCompleted(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const paymentDetails = {
        "Ngân hàng": "BIDV",
        "Số tài khoản": "4271055340",
        "Chủ tài khoản": "Đỗ Thị Thu Hà",
        "Chi nhánh": "Chi nhánh Quang Minh"
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center text-white hover:text-gray-200 transition-colors duration-200 group"
                >
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="ml-2 font-medium">Quay lại</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="bg-gradient-to-br from-blue-700 to-green-600 p-8 text-white">
                        <h1 className="text-3xl font-bold">Thanh toán</h1>
                        <p className="mt-2 opacity-90">Hoàn tất thanh toán để kích hoạt gói dịch vụ của bạn</p>
                    </div>

                    <div className="p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Gói {selectedPlan.planName}
                                    </h2>
                                    <p className="text-gray-600 mt-1">Thời hạn: 30 ngày</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {selectedPlan.planPrice}đ
                                    </p>
                                    <p className="text-gray-500">{selectedPlan.planPeriod}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* QR Code bên trái */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center space-y-4"
                            >
                                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-blue-100">
                                    <img
                                        src="/QR.jpg"
                                        alt="QR Code Thanh toán"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Quét mã QR để thanh toán nhanh chóng
                                </p>
                            </motion.div>

                            {/* Thông tin thanh toán bên phải */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Thông tin chuyển khoản
                                    </h3>

                                    {Object.entries(paymentDetails).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-600">{key}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">{value}</span>
                                                <button
                                                    onClick={() => handleCopy(value)}
                                                    className="p-1 hover:bg-black-100 rounded-md transition-colors"
                                                    title="Sao chép"
                                                >
                                                    <Copy className="h-4 w-4 text-white-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-amber-900 mb-2">Nội dung chuyển khoản:</p>
                                            <div className="bg-white px-4 py-2 rounded-lg border border-amber-200 font-medium text-gray-700">
                                                {`TÊN TK + ${selectedPlan.planName} + EMAIL`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <div className="space-y-3">
                                        <p className="font-bold text-red-500">Lưu ý:</p>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start">
                                                <span className="h-7 w-7 rounded-full  flex items-center justify-center text-base font-bold text-blue-600 mr-2 mt-0.5">1</span>
                                                <span>Nếu có vấn đề phát sinh vui lòng liên hệ hotline: <span className="text-red-600 font-semibold ">0865072140</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="h-7 w-7 rounded-full  flex items-center justify-center text-base font-bold text-blue-600 mr-2 mt-0.5">2</span>
                                                <span>Sau khi CK xong quý khách vui lòng <span className="text-red-600 font-semibold ">chụp ảnh màn hình</span> bill của quý khách! </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="h-7 w-7 rounded-full  flex items-center justify-center text-base font-bold text-blue-600 mr-2 mt-0.5">3</span>
                                                <span>Gói sẽ được cập nhật trong vòng <span className="text-red-600 font-semibold ">24h</span> kể từ lúc thanh toán thành công!</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleComplete}
                                    disabled={isCompleted}
                                    className={`w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-200 ${isCompleted
                                        ? 'bg-green-500 cursor-not-allowed'
                                        : 'bg-[#2b65a5] hover:bg-[#009345]'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            Đã hoàn thành
                                        </>
                                    ) : (
                                        'Đã hoàn thành'
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 text-center text-sm text-gray-500"
                        >
                            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Toast notification for copy */}
            {copied && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                    Đã sao chép vào clipboard
                </motion.div>
            )}
        </div>
    );
};

export default PaymentPage;