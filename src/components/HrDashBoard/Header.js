import React from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import { UserOutlined, HomeOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
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
    <Header 
      className="px-6 h-16 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #2b65a5, #009345)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        {collapsed ? (
          <MenuUnfoldOutlined className="text-2xl" />
        ) : (
          <MenuFoldOutlined className="text-2xl" />
        )}
      </button>

      {/* User Dropdown */}
      <Dropdown
        menu={dropdownStyle}
        placement="bottomRight"
        arrow
        trigger={['hover']}
      >
        <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors">
          <span className="text-white text-lg font-medium">
            Xin chào, {user ? user.name : "Admin"}
          </span>
          <Avatar
            icon={<UserOutlined />}
            className="bg-white/25 text-white border-2 border-white/50"
            size="large"
          />
        </div>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;