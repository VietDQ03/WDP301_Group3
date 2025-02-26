import React, { useState, useEffect } from 'react';
import { Check, X, Mail, Lock, RefreshCw } from 'lucide-react';
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import CustomButton from "../../components/Other/CustomButton";
import { sendOTP, checkOTP, forgetPassword } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Mật khẩu phải có ít nhất ${minLength} ký tự`);
    }
    if (!hasUpperCase) {
      errors.push('Mật khẩu phải có ít nhất 1 ký tự hoa');
    }
    if (!hasSpecialChar) {
      errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập email');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await sendOTP(formData.email);
      if (response.statusCode === 201) {
        setShowOtpInput(true);
        setCountdown(60);
        setError('');
        alert('Mã OTP đã được gửi đến email của bạn!');
      }
    } catch (err) {
      setError(err.response?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isResending && countdown === 0) {
      setIsResending(true);
      try {
        const response = await sendOTP(formData.email);
        if (response.statusCode === 201) {
          setCountdown(60);
          alert('Mã OTP đã được gửi lại!');
        }
      } catch (err) {
        setError(err.response?.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await checkOTP(formData.email, formData.otp);
      if (isValid) {
        setCurrentStep(2);
        setError('');
      } else {
        setError('Mã OTP không đúng');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        email: formData.email,
        newPassword: formData.password,
        otp: formData.otp
      };
      
      const response = await forgetPassword(data);
      
      // Kiểm tra response theo format mới
      if (response.statusCode === 201) {
        alert('Đổi mật khẩu thành công!');
        navigate('/'); // Chuyển về trang chủ
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ password }) => {
    const requirements = [
      { label: 'Ít nhất 6 ký tự', met: password.length >= 6 },
      { label: 'Ít nhất 1 ký tự hoa', met: /[A-Z]/.test(password) },
      { label: 'Ít nhất 1 ký tự đặc biệt', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];

    return (
      <div className="mt-2 space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-sm">
            {req.met ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={req.met ? 'text-green-600' : 'text-red-600'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Quên mật khẩu
            </h2>
            <p className="text-sm text-gray-500">
              {currentStep === 1 
                ? "Vui lòng nhập email để nhận mã xác thực" 
                : "Tạo mật khẩu mới cho tài khoản của bạn"}
            </p>
          </div>

          {currentStep === 1 ? (
            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={showOtpInput || isLoading}
                      className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      placeholder="Nhập email của bạn"
                    />
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {!showOtpInput && (
                  <CustomButton
                    htmlType="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang gửi...' : 'Lấy mã xác thực'}
                  </CustomButton>
                )}

                {showOtpInput && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                          Mã xác thực
                        </label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={countdown > 0 || isResending || isLoading}
                          className={`flex items-center text-sm ${
                            countdown > 0 || isResending || isLoading
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
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={formData.otp}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mã xác thực"
                      />
                    </div>
                    <CustomButton
                      htmlType="submit"
                      icon={<Check className="h-4 w-4" />}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
                    </CustomButton>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-2">
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Quay lại
                  </button>
                  <CustomButton
                    htmlType="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </CustomButton>
                </div>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;