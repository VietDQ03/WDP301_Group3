import React, { useState } from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
        <Dropdown
          menu={dropdownStyle}
          placement="bottomRight"
          arrow
          trigger={['hover']}
        >
          <div className="flex items-center gap-4 cursor-pointer">
            <span className="text-gray-600 text-lg">Welcome {user ? user.name : "Admin"}</span>
            <Avatar
              icon={<UserOutlined />}
              className="bg-blue-500"
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;