import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons"; 
import { loginUser } from "../../redux/slices/auth";
import { sendOTP } from '../../api/authAPI';
import { callActivateAccount } from '../../api/UserApi/UserApi';
import { RefreshCw, Check, X } from 'lucide-react';
import CustomButton from "../../components/Other/CustomButton";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // OTP States
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Countdown Effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendInitialOTP = async (email) => {
    try {
      const response = await sendOTP(email);
      if (response.statusCode === 201) {
        setCountdown(60);
        setOtpError('');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi gửi mã OTP');
      }
    } catch (err) {
      setOtpError(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser({
        username: formData.email,
        password: formData.password
      })).unwrap();

      if (result?.level === "VERIFY_REQUIRED") {
        setShowOtpVerification(true);
        await sendInitialOTP(formData.email);
        return;
      }

      if (result?.user?.role) {
        handleRoleNavigation(result.user.role.name);
      }
    } catch (error) {
      if (error?.level === "VERIFY_REQUIRED") {
        setShowOtpVerification(true);
        await sendInitialOTP(formData.email);
      } else {
        setErrors({
          general: error?.message || "Đăng nhập thất bại. Vui lòng thử lại."
        });
      }
    }
  };

  const handleResendOtp = async () => {
    if (!isResending && countdown === 0) {
      setIsResending(true);
      try {
        const response = await sendOTP(formData.email);
        if (response.statusCode === 201) {
          setCountdown(60);
          setOtpError('');
          alert('Mã OTP đã được gửi lại!');
        } else {
          throw new Error(response.message || 'Có lỗi xảy ra khi gửi lại mã OTP');
        }
      } catch (err) {
        setOtpError(err.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Vui lòng nhập mã OTP!");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await callActivateAccount(formData.email, otp);
      if (response.data) {
        alert("Xác thực thành công!");
        setShowOtpVerification(false);
        // Try to login again automatically
        handleLogin();
      } else {
        setOtpError("Mã OTP không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      setOtpError(error?.message || "Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRoleNavigation = (roleName) => {
    switch (roleName) {
      case "SUPER_ADMIN":
        navigate("/admin");
        break;
      case "HR_ROLE":
        navigate("/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  if (showOtpVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Xác thực OTP
            </h2>
            <p className="text-sm text-gray-500 mt-4">
              Vui lòng nhập mã xác thực được gửi đến email:{' '}
              <span className="font-medium text-gray-900">{formData.email}</span>
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mã xác thực
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending || isVerifying}
                    className={`flex items-center text-sm ${
                      countdown > 0 || isResending || isVerifying
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-500'
                    } transition-colors duration-200`}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending 
                      ? 'Đang gửi...' 
                      : countdown > 0 
                        ? `Gửi lại sau ${countdown}s` 
                        : 'Gửi lại mã'
                    }
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Nhập mã xác thực"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider"
                  maxLength={6}
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>

          {otpError && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-2 flex-shrink-0" />
                {otpError}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <ArrowLeftOutlined className="text-gray-700" />
        </button>

        <img
          src="/login.png"
          alt="Login Illustration"
          className="w-2/3 max-w-md rounded-lg shadow-lg"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Đăng nhập
          </h1>
          <div className="space-y-4">
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span></span>
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <CustomButton
              onClick={handleLogin}
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </CustomButton>

            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;