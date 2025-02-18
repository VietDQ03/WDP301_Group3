import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/auth";
import CustomButton from "../../components/Other/CustomButton"

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, user } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      console.log("Login Result:", result);
      
      // Kiểm tra data từ result
      if (result?.user?.role) {
        const roleName = result.user.role.name;
        console.log("User Role:", roleName);
  
        if (roleName === "SUPER_ADMIN") {
          navigate("/admin");
        } else if (roleName === "HR_ROLE") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log("Login Error:", error);
      setErrorMessage(error?.message || "Đã có lỗi xảy ra");
    }
  };
  
  // Vẫn giữ useEffect để handle trường hợp refresh page
  useEffect(() => {
    if (user?.role) {
      const roleName = user.role.name;
      if (roleName === "SUPER_ADMIN") {
        navigate("/admin");
      } else if (roleName === "HR_ROLE") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
        <img
          src="/login.png"
          alt="Login Illustration"
          className="w-2/3 max-w-md rounded-lg shadow-lg"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Đăng nhập
          </h1>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Tài khoản
              </label>
              <input
                id="username"
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <CustomButton 
              style={{ width: '100%' }} 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </CustomButton>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
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