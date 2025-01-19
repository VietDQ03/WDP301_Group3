import React from 'react';
import { Layout, Avatar } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  return (
    <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-600 hover:text-gray-900"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome Admin</span>
        <Avatar 
          icon={<UserOutlined />} 
          className="bg-blue-500"
        />
      </div>
    </Header>
  );
};

export default AdminHeader;