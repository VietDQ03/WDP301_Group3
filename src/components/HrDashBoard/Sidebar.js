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
    <div onClick={() => navigate(item.key)} className="relative group">
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
          <div className="absolute top-1/2 -translate-y-1/2 right-full border-8 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  );

  const BuyMoreCreditsCard = () => (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2b65a5] to-[#009345] p-6 shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-[#2b65a5] opacity-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-[#009345] opacity-20 blur-2xl"></div>
      
      <div className="mb-4 inline-block rounded-full bg-[#2b65a5]/30 p-2">
        <Star className="h-6 w-6 text-white" />
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-xl text-white mb-2">Thêm Lượt Đăng</h4>
        <p className="text-white/80 text-sm leading-relaxed">
          Đăng nhiều tin tuyển dụng hơn để tiếp cận nhiều ứng viên tiềm năng
        </p>
      </div>

      <motion.button
        onClick={() => navigate('/dashboard/pro')}
        className="group relative w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#2b65a5] shadow-md 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2b65a5] focus:ring-offset-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-[#2b65a5] group-hover:text-[#009345]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
        <span className="ml-6">Mua thêm lượt đăng tin</span>
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
        <div className="h-16 border-b border-gray-200">
          <div className="flex items-center h-full px-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            {!collapsed && <span className="ml-3 font-bold text-lg text-gray-800">DASHBOARD</span>}
          </div>
        </div>

        <nav className="flex-1 px-3 mt-2">
          {menuItems.map(item => <MenuItem key={item.key} item={item} />)}
        </nav>

        {!collapsed && (
          <div className="px-4 py-6 bg-white border-t border-gray-200">
            <BuyMoreCreditsCard />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;