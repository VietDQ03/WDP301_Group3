import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { Upload } from "lucide-react";
import ReactQuill from "react-quill";
import { callUploadSingleFile } from "../../../api/UserApi/UserApi";
import { companyApi } from "../../../api/AdminPageAPI/companyApi";

const { Option } = Select;

const EditCompanyModal = ({ visible, company, onClose, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [logo, setLogo] = useState(company?.logo || "");

  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        name: company.name,
        address: company.address,
        description: company.description,
        isActive: company.isActive,
        logo: company.logo,
      });
      setLogo(company.logo || "");
    }
  }, [company, form]);

  const handleUploadFileLogo = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;
    try {
      const res = await callUploadSingleFile(file, "company");
      if (res.data?.url) {
        setLogo(res.data.url);
        form.setFieldsValue({ logo: res.data.url });
        message.success("Logo đã được tải lên thành công!");
      } else {
        message.error("Không thể tải logo lên, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải logo lên.");
    }
  };

  const handleUpdate = async (values) => {
    const payload = { ...values, logo };
    try {
      await companyApi.update(company._id, payload);
      message.success("Cập nhật công ty thành công");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      message.error("Không thể cập nhật công ty");
    }
  };

  return (
    <Modal title="Chỉnh sửa công ty" open={visible} onCancel={onClose} footer={null}>
      <Form layout="vertical" form={form} onFinish={handleUpdate}>
        <Form.Item name="name" label="Tên Công Ty" rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}> <Input /> </Form.Item>
        <Form.Item name="address" label="Địa Chỉ"> <Input /> </Form.Item>
        <Form.Item name="description" label="Mô tả công ty"> <ReactQuill theme="snow" className="h-36" placeholder="Nhập mô tả công ty..." /> </Form.Item>
        <Form.Item name="isActive" label="Trạng thái"> 
          <Select>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Không hoạt động</Option>
          </Select>
        </Form.Item>
        <div className="space-y-2">
          <label className="block">
            <div className="flex items-center">
              <Upload className="w-5 h-5" />
              <span className="ml-2">Logo công ty</span>
              <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 w-60 justify-center">
              <Upload className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{logo ? "Cập nhật logo" : "Tải Logo"}</span>
              <input type="file" onChange={handleUploadFileLogo} accept="image/*" className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer" />
            </label>
            {logo && <span className="text-green-600">Logo đã tải lên</span>}
          </div>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">Cập nhật</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCompanyModal;