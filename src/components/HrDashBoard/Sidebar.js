import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Briefcase, FileText, UserSearch, Star, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Tổng Quan'
    },
    {
      key: '/dashboard/job',
      icon: <Briefcase size={20} />,
      label: 'Danh Sách Việc Làm'
    },
    {
      key: '/dashboard/resume',
      icon: <FileText size={20} />,
      label: 'Danh Sách Ứng Tuyển'
    },
    {
      key: '/dashboard/candidates',
      icon: <UserSearch size={20} />,
      label: 'Gợi ý Ứng Viên'
    },
    {
      key: '/dashboard/payment-history',
      icon: <Wallet size={20} />,
      label: 'Lịch sử thanh toán'
    }
  ];

  const MenuItem = ({ item }) => (
    <div onClick={() => navigate(item.key)} className="group relative">
      <div className={`
        flex items-center px-3 py-3 my-1 rounded-lg cursor-pointer transition-all duration-200
        ${location.pathname === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
      `}>
        <div className={location.pathname === item.key ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}>
          {item.icon}
        </div>
        {!collapsed && (
          <span className={`
            ml-3 font-medium whitespace-nowrap
            ${location.pathname === item.key ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}
          `}>
            {item.label}
          </span>
        )}
      </div>
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {item.label}
          <div className="border-8 border-r-gray-900 border-transparent -translate-y-1/2 absolute right-full top-1/2" />
        </div>
      )}
    </div>
  );

  const PremiumCard = () => (
    <motion.div
      className="bg-gradient-to-br p-6 rounded-xl shadow-lg from-[#2b65a5] overflow-hidden relative to-[#009345]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-[#2b65a5] h-24 rounded-full w-24 -mr-4 -mt-4 absolute blur-2xl opacity-20 right-0 top-0"></div>
      <div className="bg-[#009345] h-24 rounded-full w-24 -mb-4 -ml-4 absolute blur-2xl bottom-0 left-0 opacity-20"></div>
      
      <div className="bg-[#2b65a5]/30 p-2 rounded-full inline-block mb-4">
        <svg className="h-6 text-white w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>

      <div className="mb-4">
        <h4 className="text-white text-xl font-bold mb-2">Rabota Premium</h4>
        <p className="text-sm text-white/80 leading-relaxed">
          Nâng tầm doanh nghiệp với các tính năng độc quyền và không giới hạn
        </p>
      </div>

      <motion.button
        onClick={() => navigate('/dashboard/pro')}
        className="group relative w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#2b65a5] shadow-md 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2b65a5] focus:ring-offset-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="flex absolute inset-y-0 items-center left-0 pl-3">
          <svg className="h-5 text-[#2b65a5] w-5 group-hover:text-[#009345]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
        <span className="ml-6">Nâng cấp Premium ngay</span>
      </motion.button>
    </motion.div>
  );

  return (
    <>
      <div className={collapsed ? 'w-20' : 'w-64'} />
      <div className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out flex flex-col z-30
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="border-b border-gray-200 h-16">
          <div className="flex h-full cursor-pointer items-center px-4" onClick={() => navigate('/dashboard')}>
            <div className="flex h-10 justify-center rounded-lg w-10 items-center">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            </div>
            {!collapsed && <span className="text-gray-800 text-lg font-bold ml-3">DASHBOARD</span>}
          </div>
        </div>

        <nav className="flex-1 mt-2 px-3">
          {menuItems.map(item => <MenuItem key={item.key} item={item} />)}
        </nav>

        {!collapsed && (
          <div className="bg-white border-gray-200 border-t px-4 py-6">
            <PremiumCard />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;