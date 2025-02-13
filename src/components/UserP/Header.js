import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from 'antd';
import { LogOut, User, Home, FileText, PlusCircle, Mail, LayoutDashboard } from 'lucide-react';
import { logout } from "../../redux/slices/auth";

const navItems = [
  { icon: Home, text: "Trang Chủ", path: "/" },
  { icon: FileText, text: "Tạo CV", path: "#" },
  { icon: PlusCircle, text: "Đăng Tuyển", path: "#" },
  { icon: Mail, text: "Liên Hệ", path: "#" },
];

const NavItem = ({ Icon, text, path }) => (
  <li>
    <Link 
      to={path} 
      className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors"
    >
      <Icon size={20} />
      <span className="text-lg font-medium">{text}</span>
    </Link>
  </li>
);

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const getDropdownItems = () => {
    const baseItems = [
      {
        key: 'logout',
        icon: <LogOut size={16} />,
        label: 'Đăng xuất',
        onClick: () => {
          dispatch(logout());
        }
      }
    ];

    if (user?.role?.name === "SUPER_ADMIN") {
      baseItems.unshift({
        key: 'admin',
        icon: <LayoutDashboard size={16} />,
        label: 'Trang Admin',
        onClick: () => navigate('/admin')
      });
    } else if (user?.role?.name === "HR_ROLE") {
      baseItems.unshift({
        key: 'dashboard',
        icon: <LayoutDashboard size={16} />,
        label: 'Trang Tổng Quan',
        onClick: () => navigate('/dashboard')
      });
    }

    return baseItems;
  };

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Rabota Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold">RABOTA</h1>
        </div>

        <nav>
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.text}
                Icon={item.icon}
                text={item.text}
                path={item.path}
              />
            ))}

            {isAuthenticated ? (
              <li>
                <Dropdown
                  menu={{ items: getDropdownItems() }}
                  placement="bottomRight"
                  trigger={['click']}
                  overlayClassName="w-56"
                >
                  <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors">
                    <span className="text-lg font-medium">
                      Xin chào, {user?.name || "Admin"}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                  </div>
                </Dropdown>
              </li>
            ) : (
              <NavItem Icon={User} text="Đăng nhập" path="/login" />
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;