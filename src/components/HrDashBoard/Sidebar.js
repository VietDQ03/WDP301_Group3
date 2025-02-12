import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Building2, Briefcase, FileText } from 'lucide-react';
import { motion } from 'framer-motion';


const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Tổng Quan'
    },
    {
      key: '/dashboard/company',
      icon: <Building2 size={20} />,
      label: 'Danh Sách Công Ty'
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
  ];

  return (
    <>
      {/* Spacer div để giữ layout */}
      <div className={collapsed ? 'w-20' : 'w-64'} />

      {/* Fixed Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out flex flex-col z-30
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo section */}
        <div className="h-16 border-b border-gray-200">
          <div
            className="flex items-center h-full px-4 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            {!collapsed && (
              <span className="ml-3 font-bold text-lg text-gray-800">
                DASHBOARD
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <nav className="px-3 mt-2">
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                className="relative group"
              >
                <div className={`
                  flex items-center px-3 py-3 my-1 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${location.pathname === item.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}>
                  <div className={`
                    ${location.pathname === item.key
                      ? 'text-blue-600'
                      : 'text-gray-500 group-hover:text-gray-600'
                    }
                  `}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className={`
                      ml-3 font-medium whitespace-nowrap
                      ${location.pathname === item.key
                        ? 'text-blue-600'
                        : 'text-gray-700 group-hover:text-gray-900'
                      }
                    `}>
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Tooltip */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute top-1/2 -translate-y-1/2 right-full border-8 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {!collapsed && (
          <div className="px-4 py-6 bg-white border-t border-gray-200">
            <motion.div
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2b65a5] to-[#009345] p-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-[#2b65a5] opacity-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-[#009345] opacity-20 blur-2xl"></div>

              {/* Premium Icon */}
              <div className="mb-4 inline-block rounded-full bg-[#2b65a5]/30 p-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h4 className="font-bold text-xl text-white mb-2">
                  Rabota Premium
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  Nâng tầm doanh nghiệp với các tính năng độc quyền và không giới hạn
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => navigate('/dashboard/pro')}
                className="group relative w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#2b65a5] shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2b65a5] focus:ring-offset-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-[#2b65a5] group-hover:text-[#009345]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <span className="ml-6">Nâng cấp Premium ngay</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;