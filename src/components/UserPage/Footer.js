import React from "react";
import { Mail, Phone, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#3c4662] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">RabotaWork</h3>
            <p className="text-gray-300 text-sm">
              Nền tảng tìm việc part-time hàng đầu cho sinh viên và người đi làm
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Liên Hệ</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-300 text-sm">
                <Mail size={16} />
                rabotasp25@gmail.com
              </p>
              <p className="flex items-center gap-2 text-gray-300 text-sm">
                <Phone size={16} />
                0865072140
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Theo Dõi</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61551537480234"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 RABOTA. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;