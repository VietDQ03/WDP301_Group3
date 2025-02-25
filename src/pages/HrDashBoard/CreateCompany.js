import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Form, Input, Select, DatePicker, Modal } from "antd";
import { Pencil, MapPin, Eye, Upload, Plus, FileText, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { callCreateCompany, callUploadSingleFile } from "../../api/UserApi/UserApi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Content } = Layout;
const { Option } = Select;

const CreateCompanyForm = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: ""
  });
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

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
        showToast("Logo uploaded successfully", "success");
      } else {
        showToast("Could not upload logo, please try again", "error");
      }
    } catch (error) {
      showToast("Error occurred while uploading logo", "error");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!formData.logo) {
        showToast("Please upload a company logo!", "error");
        return;
      }

      const response = await callCreateCompany(
        values.name.trim(),
        values.address.trim(),
        values.description.trim(),
        formData.logo
      );

      if (response && response.data) {
        showToast("Company creation request sent successfully!", "success");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error occurred while creating company";
      showToast(errorMessage, "error");
    }
  };

  return (
    <Layout className="min-h-screen flex flex-row">
      <div className={`transition-all duration-300 ${collapsed ? "w-20" : "w-[255px]"}`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1">
        <Layout>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content className="m-6">
            <AnimatePresence>
              {toast.show && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                    toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                  } text-white flex items-center`}
                >
                  <span>{toast.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-screen-xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  {renderLabel(<Building2 className="w-8 h-8 text-blue-600" />, "Create New Company")}
                </h1>

                <Form
                  form={form}
                  layout="vertical"
                  className="space-y-6"
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    name="name"
                    label={renderLabel(<Pencil className="w-5 h-5" />, "Company Name")}
                    rules={[{ required: true, message: 'Please input company name!' }]}
                  >
                    <Input 
                      placeholder="Enter company name"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label={renderLabel(<MapPin className="w-5 h-5" />, "Address")}
                    rules={[{ required: true, message: 'Please input company address!' }]}
                  >
                    <Input 
                      placeholder="Enter company address"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label={renderLabel(<FileText className="w-5 h-5" />, "Description")}
                    rules={[{ required: true, message: 'Please input company description!' }]}
                  >
                    <ReactQuill
                      theme="snow"
                      className="h-64"
                      placeholder="Enter detailed description about the company"
                    />
                  </Form.Item>

                  <div className="space-y-2">
                    <label className="block">
                      {renderLabel(<Upload className="w-5 h-5" />, "Company Logo")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          onChange={handleUploadFileLogo}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      {formData.logo && (
                        <span className="text-green-600">
                          Logo uploaded successfully
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Create Company
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default CreateCompanyForm;