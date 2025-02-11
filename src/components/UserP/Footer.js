import React from "react";
import "../../pages/UserPage/HomePage.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>RABOTA</h3>
          <p>Nền tảng tìm việc part-time hàng đầu cho sinh viên và người đi làm</p>
        </div>
        <div className="footer-section">
          <h3>Liên Hệ</h3>
          <p><i className="fas fa-envelope"></i> contact@rabota.com</p>
          <p><i className="fas fa-phone"></i> 1900-xxx-xxx</p>
        </div>
        <div className="footer-section">
          <h3>Theo Dõi</h3>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 RABOTA. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
