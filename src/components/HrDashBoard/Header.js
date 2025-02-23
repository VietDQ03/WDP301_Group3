import React from 'react';
import { Layout, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logout } from '../../redux/slices/auth';

const { Header } = Layout;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateCompany = () => {
    navigate('/create-company'); // Điều hướng đến trang tạo công ty
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

  const CollapseButton = () => (
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
  );

  const CreateCompanyButton = () => (
    <Button 
      type="primary" 
      icon={<PlusOutlined />} 
      className="bg-white text-blue-600 font-medium hover:bg-gray-100 transition-all"
      onClick={handleCreateCompany}
    >
      Tạo công ty
    </Button>
  );

  const UserDropdown = () => (
    <Dropdown
      menu={menuItems}  
      placement="bottomRight"
      arrow
      trigger={['hover']}
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
  );

  return (
    <Header 
      className="px-6 h-16 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #2b65a5, #009345)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex items-center gap-4">
        <CollapseButton />
        <CreateCompanyButton />
      </div>
      <UserDropdown />
    </Header>
  );
};

export default AdminHeader;