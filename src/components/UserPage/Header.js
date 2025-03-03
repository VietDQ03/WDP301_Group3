import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from 'antd';
import { LogOut, User, Home, FileText, PlusCircle, Mail, LayoutDashboard, Menu, X } from 'lucide-react';
import { logout } from "../../redux/slices/auth";
import LoginModal from "./LoginModal";
import { useLocation } from "react-router-dom";

const NavItem = ({ Icon, text, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (path === "/") {
      e.preventDefault();
      navigate("/");
      return;
    }
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };


  return (
    <li>
      <Link
        to={path}
        onClick={handleClick}
        className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors"
      >
        <Icon size={20} />
        <span className="text-lg font-medium">{text}</span>
      </Link>
    </li>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/', { replace: true });
  }, [dispatch, navigate]);


  const navItems = [
    {
      icon: Home,
      text: "Trang Chủ",
      onClick: () => {
        navigate('/');
        window.location.reload();
      }
    },
    {
      icon: PlusCircle,
      text: "Tạo CV",
      onClick: () => {
        navigate('/create-cv');
        window.location.reload();
      }
    },
    {
      icon: PlusCircle,
      text: "Đăng Tuyển",
      onClick: () => {
        navigate('/introduce');
        window.location.reload();
      }
    }
  ];

  const getDropdownItems = () => {
    const baseItems = [
      {
        key: 'profile',
        icon: <User size={16} />,
        label: 'Thông tin cá nhân',
        onClick: () => {
          navigate('/profile');
        }
      },
      {
        key: 'logout',
        icon: <LogOut size={16} />,
        label: 'Đăng xuất',
        onClick: () => {
          dispatch(logout());
        }
      },
      
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
    } else if (user?.role?.name === "NORMAL_USER") {
      baseItems.unshift({
        key: 'jobhistory',
        icon: <LayoutDashboard size={16} />,
        label: 'Việc đã ứng tuyển',
        onClick: () => navigate('/jobhistory')
      });
    }

    return baseItems;
  };

  return (
    <>
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                navigate('/');
                window.location.reload();
              }}
            >
              <img src="/logo.png" alt="Rabota Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold hidden sm:block">RABOTAWORKS</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.text}
                    Icon={item.icon}
                    text={item.text}
                    path={item.path}
                    onClick={item.onClick}
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

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`${isMobileMenuOpen ? 'block' : 'hidden'
              } md:hidden mt-4 transition-all duration-300 ease-in-out`}
          >
            <nav>
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.text}
                    Icon={item.icon}
                    text={item.text}
                    path={item.path}
                    onClick={item.onClick}
                  />
                ))}
                {isAuthenticated ? (
                  <>
                    <div className="py-2 px-3 border-t border-white/10">
                      <span className="text-lg font-medium">
                        Xin chào, {user?.name || "Admin"}
                      </span>
                    </div>
                    {getDropdownItems().map((item) => (
                      <li key={item.key}>
                        <button
                          onClick={item.onClick}
                          className="flex items-center gap-4 w-full cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors"
                        >
                          {item.icon}
                          <span className="text-lg font-medium">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </>
                ) : (
                  <NavItem Icon={User} text="Đăng nhập" path="/login" />
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <LoginModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMessage={modalMessage}
      />
    </>
  );
};

export default Header;