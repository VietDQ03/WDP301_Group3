import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { Pencil, MapPin, Upload, FileText, Building2 } from 'lucide-react';
import { PlusOutlined } from "@ant-design/icons";
import { callCreateCompany, callUploadSingleFile } from "../../../api/UserApi/UserApi";
import { companyApi } from "../../../api/AdminPageAPI/companyApi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomButton from "../../../components/Other/CustomButton";

const AddEditCompanyModal = ({ 
  visible, 
  onClose, 
  refreshData, 
  selectedCompany = null, // null for create, object for edit
  mode = 'create' // 'create' or 'edit'
}) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && selectedCompany) {
      setFormData({
        name: selectedCompany.name,
        address: selectedCompany.address,
        description: selectedCompany.description,
        logo: selectedCompany.logo || "",
        isActive: selectedCompany.isActive
      });
      form.setFieldsValue({
        name: selectedCompany.name,
        address: selectedCompany.address,
        description: selectedCompany.description,
        isActive: selectedCompany.isActive,
        createdBy: selectedCompany.createdBy?.email || "Admin"
      });
    }
  }, [selectedCompany, form, mode]);

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

      setLoading(true);
      const payload = {
        ...values,
        logo: formData.logo
      };

      if (mode === 'create') {
        const response = await callCreateCompany(
          values.name.trim(),
          values.address.trim(),
          values.description.trim(),
          formData.logo
        );
        if (response && response.data) {
          alert("Tạo công ty thành công!");
        }
      } else {
        await companyApi.update(selectedCompany._id, payload);
        alert("Cập nhật công ty thành công!");
      }

      setLoading(false);
      refreshData();
      handleClose();
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || `Error occurred while ${mode === 'create' ? 'creating' : 'updating'} company`;
      alert(errorMessage);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFormData({ 
      name: "", 
      address: "", 
      description: "", 
      logo: "",
      isActive: true 
    });
    onClose();
  };

  return (
    <Modal
      title={renderLabel(
        <Building2 className="w-6 h-6 text-blue-600" />, 
        mode === 'create' ? "Tạo Công Ty Mới" : "Chỉnh Sửa Công Ty"
      )}
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={580}
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-6"
        onFinish={handleSubmit}
      >
        <div className={mode === 'edit' ? "grid grid-cols-2 gap-4" : ""}>
          <Form.Item
            name="name"
            label={renderLabel(<Pencil className="w-5 h-5" />, "Tên công ty")}
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
          >
            <Input placeholder="Nhập tên công ty" className="py-2" />
          </Form.Item>

          <Form.Item
            name="address"
            label={renderLabel(<MapPin className="w-5 h-5" />, "Địa chỉ công ty")}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]}
          >
            <Input placeholder="Nhập địa chỉ công ty" className="py-2" />
          </Form.Item>

          {mode === 'edit' && (
            <>
              <Form.Item
                name="createdBy"
                label="Người tạo"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Trạng thái"
              >
                <Select>
                  <Select.Option value={true}>Hoạt động</Select.Option>
                  <Select.Option value={false}>Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        <Form.Item
          name="description"
          label={renderLabel(<FileText className="w-5 h-5" />, "Mô tả công ty")}
          rules={[{ required: true, message: 'Vui lòng nhập mô tả công ty!' }]}
        >
          <ReactQuill theme="snow" className="h-36 mb-10" placeholder="Nhập mô tả về công ty" />
        </Form.Item>

        <div className="space-y-2">
          <label className="block">
            <div className="flex items-center">
              {renderLabel(<Upload className="w-5 h-5" />, "Logo công ty")}
              <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 w-60 justify-center">
              <Upload className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">
                {formData.logo ? "Cập nhật logo" : "Tải Logo"}
              </span>
              <input
                type="file"
                onChange={handleUploadFileLogo}
                accept="image/*"
                className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                style={{ display: 'block', visibility: 'hidden' }}
              />
            </label>
            {formData.logo && (
              <div className="text-xs text-green-600 truncate max-w-xs">
                {formData.logo.length > 28 ? `${formData.logo.substring(0, 28)}...` : formData.logo}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Huỷ
          </button>
          <CustomButton 
            htmlType="submit" 
            icon={mode === 'create' ? <PlusOutlined /> : <Pencil className="w-4 h-4" />} 
            loading={loading} 
            className="rounded-lg"
          >
            {mode === 'create' ? 'Tạo công ty' : 'Cập nhật'}
          </CustomButton>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditCompanyModal;