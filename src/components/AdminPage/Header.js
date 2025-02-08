import React, { useState } from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => {
        navigate('/');
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        navigate('/login');
      }
    }
  ];

  const dropdownStyle = {
    items: menuItems,
    style: {
      width: '200px',
    }
  };

  return (
    <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-600 hover:text-gray-900"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-lg">Welcome Admin</span>
        <Dropdown
          menu={dropdownStyle}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Avatar
            icon={<UserOutlined />}
            className="bg-blue-500 cursor-pointer"
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;