// Header.js
import React from "react";
import { Link } from "react-router-dom";
import "../../pages/UserPage/HomePage.css";
import { useSelector } from "react-redux";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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
              <li className="flex justify-center">
                <span>
                  <i className="fas fa-user"></i> Xin chào, {user?.name || "Người dùng"}
                </span>
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