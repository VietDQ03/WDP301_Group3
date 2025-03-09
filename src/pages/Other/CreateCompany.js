import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { Pencil, MapPin, Upload, FileText, Building2 } from 'lucide-react';
import { PlusOutlined } from "@ant-design/icons";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import { callCreateCompany, callUploadSingleFile } from "../../api/UserApi/UserApi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomButton from "../../components/Other/CustomButton";

const CreateCompany = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: ""
  });
  const navigate = useNavigate();

  const renderLabel = (icon, label) => (
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}</span>
    </div>
  );

  const handleUploadFileLogo = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;

    try {
      const res = await callUploadSingleFile(file, "company");
      if (res.data && res.data.url) {
        setFormData(prev => ({
          ...prev,
          logo: res.data.url
        }));
        alert("Logo đã được tải lên thành công");
      } else {
        alert("Không thể tải logo lên, vui lòng thử lại");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi tải logo lên");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!formData.logo) {
        alert("Vui lòng tải lên logo công ty!");
        return;
      }

      const response = await callCreateCompany(
        values.name.trim(),
        values.address.trim(),
        values.description.trim(),
        formData.logo
      );

      if (response && response.data) {
        alert("Yêu cầu tạo công ty đã được gửi thành công!");
        navigate("/admin/company/*");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error occurred while creating company";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {renderLabel(<Building2 className="w-8 h-8 text-blue-600" />, "NHẬP THÔNG TIN CÔNG TY ĐỂ TRỞ THÀNH NHÀ TUYỂN DỤNG")}
          </h1>

          <Form
            form={form}
            layout="vertical"
            className="space-y-6"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label={renderLabel(<Pencil className="w-5 h-5" />, "Tên công ty")}
              rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
            >
              <Input
                placeholder="Nhập tên công ty"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={renderLabel(<MapPin className="w-5 h-5" />, "Địa chỉ công ty")}
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]}
            >
              <Input
                placeholder="Nhập địa chi công ty"
                className="py-2"
              />
            </Form.Item>

            <div className="relative pb-10">
              <Form.Item
                name="description"
                label={renderLabel(<FileText className="w-5 h-5" />, "Mô tả công ty")}
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập mô tả công ty!',
                  style: {
                    paddingBottom: '20px'
                  }
                }]}
              >
                <ReactQuill
                  theme="snow"
                  className="h-64"
                  placeholder="Nhập mô tả về công ty của bạn"
                />
              </Form.Item>
            </div>

            <div className="space-y-2">
              <label className="block">
                <div className="flex items-center">
                  {renderLabel(<Upload className="w-5 h-5" />, "Logo công ty")}
                  <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 w-60 justify-center">
                    <Upload className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">
                      {formData.logo ? formData.logo.split('-')[0] : "Tải Logo"}
                    </span>
                    <input
                      type="file"
                      onChange={handleUploadFileLogo}
                      accept="image/*"
                      className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                {formData.logo && (
                  <span className="text-green-600">
                    Tải logo thành công
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/admin/company/*")}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Huỷ
              </button>
              <CustomButton
                htmlType="submit"
                icon={<PlusOutlined />}
                className="rounded-lg"
              >
                Tạo công ty
              </CustomButton>
            </div>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCompany;