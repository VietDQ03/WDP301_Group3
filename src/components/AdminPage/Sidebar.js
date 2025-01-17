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
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Dashboard</span>,
    },
    {
      key: '/company',
      icon: <TeamOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Company</span>,
    },
    {
      key: '/user',
      icon: <UserOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">User</span>,
    },
    {
      key: '/job',
      icon: <FileOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Job</span>,
    },
    {
      key: '/resume',
      icon: <FileOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Resume</span>,
    },
    {
      key: '/permission',
      icon: <LockOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Permission</span>,
    },
    {
      key: '/role',
      icon: <SafetyCertificateOutlined className="text-gray-600" />,
      label: <span className="text-gray-700">Role</span>,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider 
      width={220} 
      theme="light" 
      collapsible 
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="border-r border-gray-200"
    >
      <div className="p-4 font-bold text-lg flex items-center">
        <span className="text-blue-600">🔐</span>
        {!collapsed && <span className="ml-2">Admin Dashboard </span>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-r-0"
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;