import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, FileText, Users, Phone, Medal } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../../components/Other/BackButton';
import { useSelector } from 'react-redux';
import { paymentApi } from '../../api/paymentAPI';

const formatAmountForVNPay = (amount) => {
  return parseInt(amount.replace(/\D/g, ''));
};

const ProPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('cards');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSelectPlan = async (plan) => {
    if (plan.name === 'Rabota Free') return;

    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    try {
      const amount = formatAmountForVNPay(
        billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice
      );

      const paymentData = {
        amount: amount,
        orderType: "UPGRADE_PLAN",
        orderInfo: `Thanh toan goi ${plan.name} - ${billingPeriod === 'monthly' ? 'Hang thang' : 'Hang nam'} `,
        language: "vn",
        bankCode: "",
        userId: user?._id,
        returnUrl: `${window.location.origin}/payment/vnpay-return`,
        planDetails: {
          planId: plan.name,
          planType: billingPeriod,
          planDuration: billingPeriod === 'monthly' ? 30 : 365,
          originalPrice: billingPeriod === 'monthly' ? plan.originalPrice : plan.yearlyOriginalPrice,
          discountedPrice: billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice,
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
      name: 'Rabota Free',
      price: '0',
      yearlyPrice: '0',
      period: '/tháng',
      yearlyPeriod: '/năm',
      description: 'Trải nghiệm các tính năng cơ bản',
      features: [
        'Đăng 2 tin tuyển dụng/tháng',
        'Xem hồ sơ cơ bản',
        'Hỗ trợ email cơ bản',
      ],
      notIncluded: [
        'Hỗ trợ 24/7',
        'Tư vấn riêng'
      ]
    },
    {
      name: 'Rabota Basic',
      price: '199.000',
      yearlyPrice: '1.990.000',
      originalPrice: '499.000',
      yearlyOriginalPrice: '4.990.000',
      period: '/tháng',
      yearlyPeriod: '/năm',
      description: 'Giải pháp khởi đầu tối ưu cho doanh nghiệp',
      features: [
        'Đăng 5 tin tuyển dụng/tháng',
        'Hỗ trợ email',
        'Xem hồ sơ đầy đủ',
      ],
      notIncluded: [
        'Hỗ trợ 24/7',
        'Tư vấn riêng'
      ]
    },
    {
      name: 'Rabota Pro',
      price: '259.000',
      yearlyPrice: '2.590.000',
      originalPrice: '799.000',
      yearlyOriginalPrice: '7.990.000',
      period: '/tháng',
      yearlyPeriod: '/năm',
      description: 'Nâng cao hiệu quả tuyển dụng cho doanh nghiệp',
      popular: true,
      features: [
        'Tất cả tính năng Basic',
        'Đăng 10 tin tuyển dụng/tháng',
        'Hỗ trợ 24/7',
      ],
      notIncluded: [
        'Tư vấn riêng'
      ]
    },
    {
      name: 'Rabota Premium',
      price: '299.000',
      yearlyPrice: '2.990.000',
      originalPrice: '999.000',
      yearlyOriginalPrice: '9.990.000',
      period: '/tháng',
      yearlyPeriod: '/năm',
      description: 'Giải pháp tuyển dụng cao cấp dành cho doanh nghiệp',
      features: [
        'Tất cả tính năng Pro',
        'Đăng không giới hạn tin',
        'Hỗ trợ ưu tiên 24/7',
        'Độc quyền hiển thị banner',
        'Tư vấn riêng',
      ],
    }
  ];

  const comparisonFeatures = [
    {
      name: 'Số lượng tin đăng',
      icon: FileText,
      values: ['2 tin/tháng', '5 tin/tháng', '10 tin/tháng', 'Không giới hạn']
    },
    {
      name: 'Xem hồ sơ ứng viên',
      icon: Users,
      values: ['Cơ bản', 'Đầy đủ', 'Đầy đủ', 'Đầy đủ + Ưu tiên']
    },
    {
      name: 'Hỗ trợ',
      icon: Phone,
      values: ['Email cơ bản', 'Email', '24/7', 'Ưu tiên 24/7']
    },
    {
      name: 'Hiển thị tin tuyển dụng',
      icon: Medal,
      values: ['Chuẩn', 'Chuẩn', 'Ưu tiên', 'Ưu tiên + Banner']
    },
  ];

  const calculateDiscount = (original, sale) => {
    if (!original) return 0;
    const originalPrice = parseInt(original.replace(/\D/g, ''));
    const salePrice = parseInt(sale.replace(/\D/g, ''));
    return Math.round((1 - salePrice / originalPrice) * 100);
  };

  // Component xử lý callback từ VNPay
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

          // Verify payment với backend
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
      <div className="min-h-screen flex items-center justify-center">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Thanh toán thành công!</h2>
            <p className="mt-2 text-gray-600">Đang chuyển hướng về trang quản lý...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Thanh toán thất bại</h2>
            <p className="mt-2 text-gray-600">Đang chuyển hướng...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton onClick={() => navigate(-1)}>
          Quay lại
        </BackButton>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Gói Phù Hợp Với Bạn
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Giải pháp tuyển dụng phù hợp với mọi quy mô doanh nghiệp
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className=" p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 mr-5 ${billingPeriod === 'monthly'
                  ? 'bg-[#2b65a5] text-white'
                  : 'hover:bg-[#009345] hover:text-white'
                }`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${billingPeriod === 'yearly'
                  ? 'bg-[#2b65a5] text-white'
                  : 'hover:bg-[#009345] hover:text-white bg-gray-200'
                }`}
              >
                Theo năm (Tiết kiệm 2 tháng)
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${viewMode === 'cards'
                  ? 'bg-[#2b65a5] text-white'
                  : 'bg-gray-200 hover:bg-[#009345] hover:text-white text-gray-700'
                }`}
              >
                Xem gói dịch vụ
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${viewMode === 'comparison'
                  ? 'bg-[#2b65a5] text-white'
                  : 'bg-gray-200 hover:bg-[#009345] hover:text-white text-gray-700'
                }`}
              >
                So sánh chi tiết
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid md:grid-cols-4 gap-8 mt-16">
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
                className={`relative rounded-2xl bg-white p-8 shadow-lg flex flex-col ${plan.popular ? 'border-2 border-blue-500' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Phổ biến nhất
                    </div>
                  </div>
                )}

                {(billingPeriod === 'monthly' ? plan.originalPrice : plan.yearlyOriginalPrice) && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                      -{calculateDiscount(
                        billingPeriod === 'monthly' ? plan.originalPrice : plan.yearlyOriginalPrice,
                        billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice
                      )}%
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                  <div className="mt-4 flex flex-col items-center">
                    {(billingPeriod === 'monthly' ? plan.originalPrice : plan.yearlyOriginalPrice) && (
                      <span className="text-lg text-gray-500 line-through">
                        {billingPeriod === 'monthly' ? plan.originalPrice : plan.yearlyOriginalPrice}đ
                      </span>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice}đ
                      </span>
                      <span className="text-gray-500 ml-1">
                        {billingPeriod === 'monthly' ? plan.period : plan.yearlyPeriod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4 flex-grow">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded?.map((feature) => (
                    <div key={feature} className="flex items-center text-gray-400">
                      <X className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full rounded-lg px-4 py-2 text-center font-medium ${plan.name === 'Rabota Free'
                      ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors duration-200 flex items-center justify-center`}
                  >
                    <span>{plan.name === 'Rabota Free' ? 'Gói miễn phí' : 'Chọn gói này'}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="overflow-x-auto"
            >
              <table className="w-full">
                <thead>
                  <motion.tr
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-gray-200"
                  >
                    <th className="py-5 px-4 text-left text-gray-500 font-normal">Tính năng</th>
                    {plans.map((plan, index) => (
                      <motion.th
                        key={plan.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="py-5 px-4 text-center"
                      >
                        <span className="block text-lg font-semibold text-gray-900">{plan.name}</span>
                        <span className="block text-sm text-gray-500 mt-1">
                          {billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice}đ
                          {billingPeriod === 'monthly' ? plan.period : plan.yearlyPeriod}
                        </span>
                      </motion.th>
                    ))}
                  </motion.tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <motion.tr
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-4 px-4 flex items-center">
                        <feature.icon className="h-5 w-5 text-gray-400 mr-2" />
                        {feature.name}
                      </td>
                      {feature.values.map((value, index) => (
                        <td key={index} className="py-4 px-4 text-center">{value}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Cần giải pháp đặc biệt? Liên hệ hotline: {' '}
            <span className="text-red-500 font-medium">
              0865072140
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProPage;