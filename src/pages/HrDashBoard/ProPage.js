import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, FileText, Users, Phone, Medal, Clock, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/Other/BackButton';

const ProPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('cards');

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSelectPlan = (plan) => {
    if (plan.name === 'Rabota Free') return;
    navigate('/payment', {
      state: {
        planName: plan.name,
        planPrice: plan.price,
        planPeriod: plan.period,
        planFeatures: plan.features,
      }
    });
  };

  const plans = [
    {
      name: 'Rabota Free',
      price: '0',
      period: '/tháng',
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
      originalPrice: '499.000',
      period: '/tháng',
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
      originalPrice: '799.000',
      period: '/tháng',
      description: 'Nâng cao hiệu quả tuyển dụng cho doanh nghiệp',
      popular: true,
      features: [
        'Tất cả tính năng Basic',
        'Đăng 10 tin tuyển dụng/tháng',
        'Hỗ trợ 24/7',
        // 'Ưu tiên hiển thị tin',
      ],
      notIncluded: [
        'Tư vấn riêng'
      ]
    },
    {
      name: 'Rabota Premium',
      price: '299.000',
      originalPrice: '999.000',
      period: '/tháng',
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
    // {
    //   name: 'Thời gian đăng tin',
    //   icon: Clock,
    //   values: ['7 ngày', '15 ngày', '30 ngày', '45 ngày']
    // },
    // {
    //   name: 'Thông báo ứng viên',
    //   icon: Bell,
    //   values: ['Không', 'Có', 'Có', 'Có']
    // },
  ];

  const calculateDiscount = (original, sale) => {
    if (!original) return 0;
    const originalPrice = parseInt(original.replace(/\D/g, ''));
    const salePrice = parseInt(sale.replace(/\D/g, ''));
    return Math.round((1 - salePrice / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton
          onClick={() => navigate(-1)}
        >
          Quay lại
        </BackButton>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Gói Phù Hợp Với Bạn
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Giải pháp tuyển dụng phù hợp với mọi quy mô doanh nghiệp
          </p>

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

                {plan.originalPrice && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                      -{calculateDiscount(plan.originalPrice, plan.price)}%
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                  <div className="mt-4 flex flex-col items-center">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {plan.originalPrice}đ
                      </span>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}đ
                      </span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
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
              className="overflow-x-auto scrollbar-hide"
              style={{ 
                overscrollBehavior: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="min-w-full inline-block align-middle">
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
                            {plan.price}đ{plan.period}
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
                        transition={{ 
                          delay: idx * 0.1, 
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <motion.td 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                          className="py-4 px-4 flex items-center"
                        >
                          <feature.icon className="h-5 w-5 text-gray-400 mr-2" />
                          {feature.name}
                        </motion.td>
                        {feature.values.map((value, index) => (
                          <motion.td 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: idx * 0.1 + index * 0.1, 
                              duration: 0.5,
                              ease: "easeOut"
                            }}
                            className="py-4 px-4 text-center"
                          >
                            {value}
                          </motion.td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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