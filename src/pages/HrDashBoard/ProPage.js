import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/Other/BackButton';

const ProPage = () => {
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSelectPlan = (plan) => {
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
      name: 'Rabota Basic',
      price: '99.000',
      originalPrice: '299.000',
      period: '/tháng',
      description: 'Giải pháp khởi đầu tối ưu cho doanh nghiệp',
      features: [
        'Đăng 5 tin tuyển dụng/tháng',
        'Thống kê chi tiết',
        'Hỗ trợ email',
      ],
      notIncluded: [
        'Hỗ trợ 24/7',
      ]
    },
    {
      name: 'Rabota Pro',
      price: '159.000',
      originalPrice: '399.000',
      period: '/tháng',
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
      price: '199.000',
      originalPrice: '499.000',
      period: '/tháng',
      description: 'Giải pháp tuyển dụng cao cấp dành cho doanh nghiệp',
      features: [
        'Tất cả tính năng Pro',
        'Đăng không giới hạn tin',
        'Hỗ trợ ưu tiên 24/7',
        'Độc quyền hiển thị banner quảng cáo ưu tiên'
      ],
    }
  ];

  const calculateDiscount = (original, sale) => {
    const originalPrice = parseInt(original.replace(/\D/g, ''));
    const salePrice = parseInt(sale.replace(/\D/g, ''));
    return Math.round((1 - salePrice / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton onClick={handleNavigateToDashboard}>
          Quay lại
        </BackButton>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Gói Phù Hợp Với Bạn
          </h1>
          <p className="text-xl text-gray-600">
            Giải pháp tuyển dụng phù hợp với mọi quy mô doanh nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
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
              className={`relative rounded-2xl bg-white p-8 shadow-lg flex flex-col ${
                plan.popular ? 'border-2 border-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  -{calculateDiscount(plan.originalPrice, plan.price)}%
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-lg text-gray-500 line-through">
                    {plan.originalPrice}đ
                  </span>
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
                  className={`w-full rounded-lg px-4 py-2 text-center font-medium ${
                    plan.popular
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors duration-200 flex items-center justify-center`}
                >
                  <span>Chọn gói này</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

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