import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="max-w-lg p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Bạn không có quyền truy cập trang này
        </h2>
        <p className="text-gray-600 mb-6">
          Xin lỗi, bạn không có quyền truy cập trang này. Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ quản trị viên.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;