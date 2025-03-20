import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { loginUser } from "../../redux/slices/auth";
import { sendOTP } from '../../api/authAPI';
import { callActivateAccount } from '../../api/UserApi/UserApi';
import { RefreshCw, Check, X, EyeOff, Eye } from 'lucide-react';
import CustomButton from "../../components/Other/CustomButton";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login`;
  };

  if (showOtpVerification) {
    return (
      <div className="flex bg-gradient-to-br justify-center from-blue-50 items-center lg:px-8 min-h-screen px-4 py-12 sm:px-6 to-indigo-50">
        <div className="bg-opacity-90 bg-white border border-gray-100 p-8 rounded-2xl shadow-lg w-full backdrop-blur-sm max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl text-gray-900 font-bold tracking-tight">
              Xác thực OTP
            </h2>
            <p className="text-gray-500 text-sm mt-4">
              Vui lòng nhập mã xác thực được gửi đến email:{' '}
              <span className="text-gray-900 font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-700 text-sm block font-medium">
                    Mã xác thực
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending || isVerifying}
                    className={`flex items-center text-sm ${countdown > 0 || isResending || isVerifying
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
                  className="border border-gray-200 rounded-lg text-center text-lg w-full appearance-none block focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 px-3 py-3 tracking-wider"
                  maxLength={6}
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="flex bg-blue-600 border border-transparent justify-center rounded-lg shadow-sm text-sm text-white w-full disabled:bg-blue-300 disabled:cursor-not-allowed duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium hover:bg-blue-700 items-center px-4 py-3 transition-colors"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
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
            <div className="bg-red-50 p-3 rounded-lg mt-4">
              <p className="flex text-red-600 text-sm items-center">
                <X className="flex-shrink-0 h-4 w-4 mr-2" />
                {otpError}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br justify-center from-green-400 hidden items-center md:flex relative to-blue-500">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex bg-white p-2 rounded-full shadow-md absolute gap-2 hover:bg-gray-100 items-center left-4 top-4 transition"
        >
          <ArrowLeftOutlined className="text-gray-700" />
        </button>

        <img
          src="/login.png"
          alt="Login Illustration"
          className="rounded-lg shadow-lg w-2/3 max-w-md"
        />
      </div>

      <div className="flex flex-1 justify-center p-6 items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl text-center text-gray-800 font-bold mb-6">
            Đăng nhập
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-600 text-sm block font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-gray-600 text-sm block font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={handleChange}
                  className="border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 -translate-y-1/2 absolute hover:text-gray-700 right-3 top-1/2 transform"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-between text-gray-600 text-sm items-center">
              <span></span>
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <CustomButton
              htmlType="submit"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </CustomButton>

            <div className="mt-4 relative">
              <div className="flex justify-center items-center">
                <span className="bg-white text-gray-500 px-4">hoặc</span>
              </div>
              <button
                type="button"
                className="flex border border-gray-300 justify-center rounded-lg shadow-sm text-gray-700 w-full gap-2 hover:bg-gray-100 items-center mt-4 py-2 transition"
                onClick={handleGoogleLogin}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="h-5 w-5" />
                Đăng nhập với Google
              </button>
            </div>

            {errors.general && (
              <p className="text-center text-red-500 text-sm">{errors.general}</p>
            )}
          </form>

          <div className="text-center text-gray-600 text-sm mt-6">
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