import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import {
  PlusOutlined,
  EnvironmentOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { callCreateCompany, callUploadSingleFile } from "../../api/UserApi/UserApi";
import CustomButton from "../../components/Other/CustomButton";
import { v4 as uuidv4 } from "uuid";

const { Content } = Layout;

const CreateCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: ""
  });

  const [dataLogo, setDataLogo] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUploadFileLogo = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;
    console.log(file)

    try {
      const res = await callUploadSingleFile(file, "company");

      console.log("🔹 API Response:", res);
      console.log("🔹 API Response Data:", res.data);

      if (res.data && res.data.url) {
        const newLogo = [
          {
            name: res.data.url,
            uid: uuidv4(),
            file: file,
          },
        ];
        setDataLogo(newLogo);
      } else {
        console.error("❌ Không tìm thấy URL ảnh trong response.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi upload:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logo:", dataLogo);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);


      formDataToSend.append("logo", dataLogo[0].name);


      const response = await callCreateCompany(formDataToSend);
      console.log("Company created:", response.data);
      alert("Yêu cầu tạo công ty đã được gửi thành công vui lòng đợi xác minh");
      navigate("/dashboard");

      setFormData({ name: "", address: "", description: "", logo: "" });
    } catch (error) {
      console.error("Lỗi khi tạo công ty:", error);
    }
  };

  return (
    <Layout className="min-h-screen flex flex-row">
      <div
        className={`transition-all duration-300 ${collapsed ? "w-20" : "w-[255px]"
          } flex-shrink-0`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1">
        <Layout>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content className="m-6">
            <div className="max-w-screen-2xl mx-auto">
              <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Create Company
                </h1>

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

                  {/* Input: Upload Logo */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tải lên logo công ty
                    </label>
                    <div className="relative">
                      <UploadOutlined className="absolute left-3 top-3 text-gray-500 text-lg" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadFileLogo}
                        className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Vui lòng tải lên logo của công ty (hỗ trợ file ảnh PNG, JPG).
                    </p>
                    {dataLogo.length > 0 && (
                      <p className="text-green-600 mt-1">
                        Logo đã được tải lên: {dataLogo[0].name}
                      </p>
                    )}
                  </div>

                  <CustomButton
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    className="w-full"
                  >
                    Create Company
                  </CustomButton>
                </form>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default CreateCompanyForm;