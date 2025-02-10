import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  FileOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Tổng Quan</span>,
    },
    {
      key: '/admin/company',
      icon: <TeamOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Công Ty</span>,
    },
    {
      key: '/admin/user',
      icon: <UserOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Người Dùng</span>,
    },
    {
      key: '/admin/job',
      icon: <ShoppingOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Việc Làm</span>,
    },
    {
      key: '/admin/resume',
      icon: <FileOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Ứng Tuyển</span>,
    },
    {
      key: '/admin/permission',
      icon: <LockOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Quyền Hạn</span>,
    },
    {
      key: '/admin/role',
      icon: <SafetyCertificateOutlined className="text-gray-500" />,
      label: <span className="text-white-700 font-medium">Danh Sách Vai Trò</span>,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      width={250}
      theme="light"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="border-r border-gray-200 shadow-sm bg-white"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div
        className="flex items-center p-4 mx-2 my-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        onClick={() => navigate('/admin')}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
          <span className="text-blue-600 text-xl">🔐</span>
        </div>
        {!collapsed && (
          <div className="ml-3 font-semibold text-lg text-gray-800 truncate">
            Admin Dashboard
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-r-0 font-medium"
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          borderRight: 'none',
        }}
        theme="light"
        css={`
          .ant-menu-item {
            margin: 4px 8px !important;
            border-radius: 6px !important;
            &:hover {
              background-color: #EBF5FF !important;
            }
            &.ant-menu-item-selected {
              background-color: #EBF5FF !important;
              color: #2563EB !important;
              &::after {
                display: none;
              }
            }
          }
          .ant-menu-item-icon {
            width: 20px !important;
            height: 20px !important;
          }
        `}
      />

    </Sider>
  );
};

export default Sidebar;