import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { sendOTP } from '../../api/authAPI'; // Import API function

const OtpVerification = ({ 
  userEmail, 
  otp, 
  setOtp, 
  handleVerifyOtp, 
  isVerifying
}) => {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOtp = async () => {
    if (!isResending && countdown === 0) {
      setIsResending(true);
      try {
        const response = await sendOTP(userEmail);
        if (response.statusCode === 201) {
          setCountdown(60);
          setError('');
          alert('Mã OTP đã được gửi lại!');
        } else {
          throw new Error(response.message || 'Có lỗi xảy ra khi gửi lại mã OTP');
        }
      } catch (err) {
        setError(err.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Xác thực OTP
          </h2>
          <p className="text-sm text-gray-500 mt-4">
            Vui lòng nhập mã xác thực được gửi đến email:{' '}
            <span className="font-medium text-gray-900">{userEmail}</span>
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
  );
};

export default OtpVerification;