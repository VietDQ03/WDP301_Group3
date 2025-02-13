import React from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import { UserOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logout } from "../../redux/slices/auth";

const { Header } = Layout;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

 const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = {
    items: [
      {
        key: 'home',
        icon: <HomeOutlined />,
        label: 'Trang chủ',
        onClick: () => navigate('/')
      },
      {
        key: 'logout',
        icon: <LogOut size={16} />,
        label: 'Đăng xuất',
        onClick: handleLogout
      }
    ]
  };

  return (
    <Header
      className="px-6 h-16 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #2b65a5, #009345)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        {collapsed ? (
          <MenuUnfoldOutlined className="text-2xl" />
        ) : (
          <MenuFoldOutlined className="text-2xl" />
        )}
      </button>

      <Dropdown
        menu={menuItems}
        placement="bottomRight"
        arrow
        trigger={['click']}
      >
        <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors">
          <span className="text-white text-lg font-medium">
            Xin chào, {user?.name || "Admin"}
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