import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { registerUser } from "../../redux/slices/auth";
import { callActivateAccount } from "../../api/UserApi/UserApi";
import CustomButton from "../../components/Other/CustomButton";
import OtpVerification from "../../components/Other/OtpVerification";
import { Eye, EyeOff } from "lucide-react";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const [userEmail, setUserEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Vui lòng nhập tên của bạn.";
    if (!formData.email) newErrors.email = "Vui lòng nhập email.";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    if (!formData.age) newErrors.age = "Vui lòng nhập tuổi của bạn.";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính.";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!uppercaseRegex.test(formData.password) || !specialCharRegex.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất một chữ cái in hoa và một ký tự đặc biệt.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: formData.address,
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      setUserEmail(formData.email);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      alert(error?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Vui lòng nhập mã OTP!");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await callActivateAccount(userEmail, otp);
      if (response.data) {
        alert("Xác thực thành công!");
        navigate("/login");
      } else {
        alert("Mã OTP không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert(error?.message || "Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {!isOtpSent ? (
        <div className="flex min-h-screen bg-gray-50">
          <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ArrowLeftOutlined className="text-gray-700" />
            </button>            <img
              src="/login.png"
              alt="Register Illustration"
              className="w-2/3 max-w-md rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Đăng ký
              </h1>
              <div className="space-y-4">
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
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

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
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

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
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

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
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

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

                <CustomButton
                  onClick={handleRegister}
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </CustomButton>

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
        <OtpVerification 
          userEmail={userEmail}
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          isVerifying={isVerifying}
        />
      )}
    </div>
  );
}

export default RegisterPage;