import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../../components/Other/BackButton';
import { useSelector } from 'react-redux';
import { paymentApi } from '../../api/paymentAPI';

const formatAmountForVNPay = (amount) => {
  return parseInt(amount.replace(/\D/g, ''));
};

const ProPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSelectPlan = async (plan) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    try {
      const amount = formatAmountForVNPay(plan.price);

      const paymentData = {
        amount: amount,
        orderType: "BUY_CREDITS",
        orderInfo: `Mua them ${plan.name}`,
        language: "vn",
        bankCode: "",
        userId: user?._id,
        returnUrl: `${window.location.origin}/payment/vnpay-return`,
        planDetails: {
          planId: plan.name,
          planType: 'credits',
          planDuration: 30,
          originalPrice: plan.originalPrice,
          discountedPrice: plan.price,
          features: plan.features
        }
      };

      const response = await paymentApi.create(paymentData);

      if (response.data?.paymentUrl) {
        localStorage.setItem('pendingPayment', JSON.stringify({
          planName: plan.name,
          amount: amount,
          orderId: response.data.orderId,
          timestamp: new Date().getTime()
        }));
        window.open(response.data.paymentUrl, '_blank');
      } else {
        alert('Không thể tạo link thanh toán. Vui lòng thử lại sau.');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const plans = [
    {
      name: '3 Lượt Đăng',
      price: '99.000',
      originalPrice: '199.000',
      description: 'Thêm 3 lượt đăng tin tuyển dụng',
      features: [
        'Thêm 3 lượt đăng tin',
        'Hiệu lực 30 ngày',
        'Dùng cho tài khoản hiện tại',
      ],
    },
    {
      name: '5 Lượt Đăng',
      price: '159.000',
      originalPrice: '299.000',
      description: 'Thêm 5 lượt đăng tin tuyển dụng', 
      popular: true,
      features: [
        'Thêm 5 lượt đăng tin',
        'Hiệu lực 30 ngày',
        'Dùng cho tài khoản hiện tại',
      ],
    },
    {
      name: '10 Lượt Đăng',
      price: '299.000',
      originalPrice: '499.000',
      description: 'Thêm 10 lượt đăng tin tuyển dụng',
      features: [
        'Thêm 10 lượt đăng tin',
        'Hiệu lực 30 ngày',
        'Dùng cho tài khoản hiện tại',
      ],
    }
  ];

  const calculateDiscount = (original, sale) => {
    if (!original) return 0;
    const originalPrice = parseInt(original.replace(/\D/g, ''));
    const salePrice = parseInt(sale.replace(/\D/g, ''));
    return Math.round((1 - salePrice / originalPrice) * 100);
  };

  const VNPayReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');

    useEffect(() => {
      const verifyPayment = async () => {
        try {
          const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
          
          if (!pendingPayment) {
            throw new Error('Không tìm thấy thông tin thanh toán');
          }

          const response = await paymentApi.handleVNPayReturn({
            vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
            vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus'),
            vnp_TxnRef: searchParams.get('vnp_TxnRef'),
            vnp_Amount: searchParams.get('vnp_Amount'),
            orderId: pendingPayment.orderId,
            planName: pendingPayment.planName,
            originalAmount: pendingPayment.amount
          });

          if (response.data.success) {
            setStatus('success');
            localStorage.removeItem('pendingPayment');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            setStatus('failed');
            setTimeout(() => {
              navigate('/payment/failed');
            }, 2000);
          }

        } catch (error) {
          console.error('Verification error:', error);
          setStatus('failed');
          navigate('/payment/failed');
        }
      };

      verifyPayment();
    }, []);

    return (
      <div className="flex justify-center items-center min-h-screen">
        {status === 'processing' && (
          <div className="text-center">
            <div className="border-b-2 border-blue-500 h-12 rounded-full w-12 animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang xử lý kết quả thanh toán...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="flex bg-green-100 h-16 justify-center rounded-full w-16 items-center mx-auto">
              <Check className="h-8 text-green-500 w-8" />
            </div>
            <h2 className="text-xl font-semibold mt-4">Thanh toán thành công!</h2>
            <p className="text-gray-600 mt-2">Đang chuyển hướng về trang quản lý...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="flex bg-red-100 h-16 justify-center rounded-full w-16 items-center mx-auto">
              <X className="h-8 text-red-500 w-8" />
            </div>
            <h2 className="text-xl font-semibold mt-4">Thanh toán thất bại</h2>
            <p className="text-gray-600 mt-2">Đang chuyển hướng...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 lg:px-8 min-h-screen px-4 py-12 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <BackButton onClick={() => navigate(-1)}>
          Quay lại
        </BackButton>

        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 font-bold mb-4">
            Mua Thêm Lượt Đăng Tin
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Đăng nhiều tin tuyển dụng hơn để tiếp cận nhiều ứng viên tiềm năng
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl bg-white p-8 shadow-lg flex flex-col ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-0">
                    <div className="bg-blue-500 rounded-full text-sm text-white font-medium px-4 py-1">
                      Phổ biến nhất
                    </div>
                  </div>
                )}

                {plan.originalPrice && (
                  <div className="absolute right-4 top-4">
                    <div className="bg-red-500 rounded-lg text-sm text-white font-medium px-2 py-1">
                      -{calculateDiscount(plan.originalPrice, plan.price)}%
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-gray-900 text-xl font-semibold">{plan.name}</h3>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                  <div className="flex flex-col items-center mt-4">
                    {plan.originalPrice && (
                      <span className="text-gray-500 text-lg line-through">
                        {plan.originalPrice}đ
                      </span>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-4xl text-gray-900 font-bold">
                        {plan.price}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="flex-shrink-0 h-5 text-green-500 w-5" />
                      <span className="text-gray-600 ml-3">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full rounded-lg px-4 py-2 text-center font-medium ${
                      plan.popular
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors duration-200 flex items-center justify-center`}
                  >
                    <span>Chọn gói này</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Cần giải pháp đặc biệt? Liên hệ hotline: {' '}
            <span className="text-red-500 font-medium">
              0123456789
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProPage;