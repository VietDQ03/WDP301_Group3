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
          <p><i className="fas fa-envelope"></i> rabotasp25@gmail.com</p>
          <p><i className="fas fa-phone"></i> 0865072140</p>
        </div>
        <div className="footer-section">
          <h3>Theo Dõi</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61551537480234&mibextid=wwXIfr&rdid=IJvbMvKBsJvBuO6V&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F12H8M3Uo3Eh%2F%3Fmibextid%3DwwXIfr#"><i className="fab fa-facebook"></i></a>
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
