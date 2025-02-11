import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProPage = () => {
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSelectPlan = (plan) => {
    // Chuyển đến trang payment với thông tin gói đã chọn
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
      name: 'Cơ Bản',
      price: '499.000',
      period: '/tháng',
      description: 'Dành cho doanh nghiệp nhỏ',
      features: [
        'Đăng 10 tin tuyển dụng/tháng',
        'Xem 50 hồ sơ ứng viên',
        'Hỗ trợ email',
        'Thống kê cơ bản',
        'Tùy chỉnh mẫu JD',
      ],
      notIncluded: [
        'API Integration',
        'Hỗ trợ 24/7',
        'Phân tích nâng cao'
      ]
    },
    {
      name: 'Chuyên Nghiệp',
      price: '999.000',
      period: '/tháng',
      description: 'Dành cho doanh nghiệp vừa',
      popular: true,
      features: [
        'Đăng không giới hạn tin',
        'Xem 200 hồ sơ ứng viên',
        'Hỗ trợ 24/7',
        'Thống kê chuyên sâu',
        'Tùy chỉnh thương hiệu',
        'API Integration',
        'Công cụ đánh giá ứng viên',
      ],
      notIncluded: [
        'White-label solution',
      ]
    },
    {
      name: 'Doanh Nghiệp',
      price: '1.999.000',
      period: '/tháng',
      description: 'Dành cho tập đoàn lớn',
      features: [
        'Tất cả tính năng Chuyên Nghiệp',
        'White-label solution',
        'Tư vấn riêng',
        'SLA cam kết',
        'Tùy chỉnh theo yêu cầu',
        'Đào tạo nhân sự',
        'Báo cáo tùy chỉnh',
      ],
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleNavigateToDashboard}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="ml-2 font-medium">Về Dashboard</span>
        </motion.button>

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
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
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

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}đ
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
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
            Cần giải pháp đặc biệt? {' '}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="text-blue-500 font-medium hover:text-blue-600"
            >
              Liên hệ với chúng tôi
            </motion.button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProPage;