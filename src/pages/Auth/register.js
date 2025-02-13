import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/slices/auth";
import { callActivateAccount } from "../../api/UserApi/UserApi";
import CustomButton from "../../components/CustomButton"

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    address: "",
  });

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Lưu email để xác thực OTP

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age,
      gender: formData.gender,
      address: formData.address,
    };

    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      console.log("Đăng ký thành công:", result);

      setUserEmail(formData.email);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await callActivateAccount(userEmail, otp); // Gọi API xác minh OTP
  
      if (response.data) { 
        alert("Xác thực thành công!");
        navigate("/login"); 
      } else {
        alert("Mã OTP không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert("Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-gray-50">
      {!isOtpSent ? (
        // Form đăng ký
        <div className="flex min-h-screen bg-gray-50">
          {/* Left Section */}
          <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
            <img
              src="/login.png"
              alt="Register Illustration"
              className="w-2/3 max-w-md rounded-lg shadow-lg"
            />
          </div>

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Đăng ký
              </h1>
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                    Tên của bạn
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Age Input */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-600">
                    Tuổi
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Nhập tuổi của bạn"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Gender Input */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                {/* Address Input */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                    Địa chỉ
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Nhập địa chỉ của bạn"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Submit Button */}
                <CustomButton style={{width: '100%'}}>
                  {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </CustomButton>

                {/* Hiển thị lỗi */}
                {error && (
                  <div className="mt-4 text-center text-red-500">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-purple-500 hover:underline">
                  Đăng nhập ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Form nhập OTP
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Nhập mã OTP
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Vui lòng nhập mã OTP được gửi đến email <b>{userEmail}</b>
            </p>
            <input
              type="text"
              placeholder="Nhập OTP 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-center text-xl tracking-widest"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-purple-500 text-white py-2 rounded-lg mt-4"
            >
              Xác thực
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;