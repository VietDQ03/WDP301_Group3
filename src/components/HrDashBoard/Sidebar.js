import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
    // {
    //   key: '/dashboard/pro',
    //   icon: <Star size={20} />,
    //   label: 'Rabota Pro'
    // }
  ];

  return (
    <div
      className={`
        relative h-screen bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo section */}
      <div
        className="flex items-center px-4 py-6 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-lg text-gray-800">
            DASHBOARD
          </span>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 mt-2">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.key)}
            className={`
              flex items-center px-3 py-3 my-1 rounded-lg cursor-pointer
              transition-all duration-200 group
              ${location.pathname === item.key
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
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
        ))}
      </nav>

      {/* Pro Badge */}
      {!collapsed && (
        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h4 className="font-semibold mb-1">Nâng cấp Pro</h4>
            <p className="text-sm text-blue-100">
              Trải nghiệm tất cả tính năng cao cấp
            </p>
            <button 
              onClick={() => navigate('/dashboard/pro')}
              className="mt-3 px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;