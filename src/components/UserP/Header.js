// Header.js
import React from "react";
import { Link } from "react-router-dom";
import "../../pages/UserPage/HomePage.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import { logout } from "../../redux/slices/auth"; // Import action từ authSlice
import CustomButton from "../CustomButton"


const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };

  return (
    <header>
      <div className="header-content">
        <div className="logo-container">
          <div className="logo">
            <img src="/logo.png" alt="Rabota Logo" className="logo" />
          </div>
          <h1>RABOTA</h1>
        </div>
        <nav>
          <ul>
            <li><Link to="/"><i className="fas fa-home"></i> Trang Chủ</Link></li>
            <li><Link to="#"><i className="fas fa-file-alt"></i> Tạo CV</Link></li>
            <li><Link to="#"><i className="fas fa-plus-circle"></i> Đăng Tuyển</Link></li>
            <li><Link to="#"><i className="fas fa-envelope"></i> Liên Hệ</Link></li>

            {/* Kiểm tra trạng thái đăng nhập */}
            {isAuthenticated ? (
              <li className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <i className="fas fa-user"></i> Xin chào, {user?.name || "Người dùng"}
                  <i className="fas fa-chevron-down"></i>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 rounded-xl shadow-lg overflow-hidden transition-all duration-200 ease-in-out">
                    <li>
                      <CustomButton
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-red-50 text-green-600 transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                      </CustomButton>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li><Link to="/login"><i className="fas fa-sign-in-alt"></i> Đăng nhập</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;