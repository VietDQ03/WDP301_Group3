import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callCreateCompany } from "../../api/UserApi/UserApi";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { PlusOutlined, EnvironmentOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const CreateCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: "",
  });

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = window.localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi tạo công ty!");
      return;
    }

    try {
      const response = await callCreateCompany(
        formData.name,
        formData.address,
        formData.description,
        formData.logo,
        token
      );
      console.log("Company created:", response.data);
      alert("Yêu cầu tạo công ty đã được gửi thành công vui lòng đợi xác minh");
      navigate("/dashboard");

      setFormData({ name: "", address: "", description: "", logo: "" });
    } catch (error) {
      console.error("Lỗi khi tạo công ty:", error);
      alert("Lỗi khi tạo công ty. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Nội dung chính */}
        <div className="flex-1 p-6">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />

          <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Create Company
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input: Company Name */}
              <div className="relative">
                <EditOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                <input
                  type="text"
                  name="name"
                  placeholder="Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Input: Address */}
              <div className="relative">
                <EnvironmentOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Input: Description */}
              <div className="relative">
                <EyeOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
                ></textarea>
              </div>

              {/* Input: Logo URL */}
              <div className="relative">
                <PlusOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                <input
                  type="text"
                  name="logo"
                  placeholder="Logo URL"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <PlusOutlined />
                Create Company
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyForm;