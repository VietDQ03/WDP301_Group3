import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Space, Button, Spin } from 'antd';
import {
    User,
    Mail,
    Calendar,
    FileText,
    Users,
    Building,
    Check,
} from 'lucide-react';
import debounce from 'lodash/debounce';
import { companyApi } from "../../../api/AdminPageAPI/companyApi";


const EditUserModal = ({
    visible,
    onCancel,
    onFinish,
    editingUser,
    roles,
    loading: formLoading,
    selectedRole,
    setSelectedRole,
    form
}) => {
    const [companies, setCompanies] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [companyPagination, setCompanyPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Fetch companies với debounce search
    const fetchCompanies = async (search = '') => {
        setCompanyLoading(true);
        try {
            const response = await companyApi.getAll({
                page: 1,
                pageSize: 100, // Lấy nhiều hơn để search local
                ...(search ? { search } : {}) // Chỉ thêm search param khi có giá trị
            });

            if (response?.data?.data) {
                const { result } = response.data.data;
                setCompanies(result.map(company => ({
                    label: company.name,
                    value: company._id,
                    data: company // Lưu full data để submit
                })));
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
        setCompanyLoading(false);
    };
    // Debounce search
    const debouncedSearch = debounce((value) => {
        fetchCompanies(value);
    }, 500);

    // Initial fetch
    useEffect(() => {
        if (visible && selectedRole === '67566b60671f5436a0de69a5') {
            fetchCompanies();
        }
    }, [visible, selectedRole]);

    return (
        <Modal
            title={
                <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 -mt-6 -mx-6 mb-6 rounded-t-lg">
                    <Users className="w-7 h-7 text-white" />
                    <span className="text-xl font-semibold text-white">Chỉnh sửa thông tin người dùng</span>
                </div>
            }
            open={visible}
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            footer={null}
            width={800}
            className="custom-modal"
            destroyOnClose
            centered
        >
            <div className="px-2">
                <Form
                    form={form}
                    initialValues={{
                        ...editingUser,
                        role: editingUser?.role,
                        company: editingUser?.company?._id
                    }}
                    onFinish={(values) => {
                        // Tìm company object từ selected ID
                        const selectedCompany = companies.find(c => c.value === values.company)?.data;
                        onFinish({
                            ...values,
                            company: selectedCompany
                        });
                    }}
                    layout="vertical"
                    className="space-y-5"
                >
                    {/* Basic Information Section */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Form.Item
                                name="name"
                                label={
                                    <span className="text-gray-600 font-medium">Tên người dùng</span>
                                }
                                rules={[
                                    { required: true, message: 'Name không được để trống' },
                                    { whitespace: true, message: 'Name không được chỉ chứa khoảng trắng' }
                                ]}
                            >
                                <Input
                                    prefix={<User className="w-4 h-4 text-gray-400 mr-2" />}
                                    placeholder="Nhập tên người dùng"
                                    className="h-11 rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label={
                                    <span className="text-gray-600 font-medium">Email</span>
                                }
                                rules={[
                                    { required: true, message: 'Email không được để trống' },
                                    { type: 'email', message: 'Email không đúng định dạng' }
                                ]}
                            >
                                <Input
                                    prefix={<Mail className="w-4 h-4 text-gray-400 mr-2" />}
                                    placeholder="Nhập email"
                                    className="h-11 rounded-lg"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Thông tin cá nhân
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Form.Item
                                name="age"
                                label={
                                    <span className="text-gray-600 font-medium">Tuổi</span>
                                }
                                rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={120}
                                    placeholder="Nhập tuổi"
                                    className="h-11 w-full rounded-lg"
                                    prefix={<Calendar className="w-4 h-4 text-gray-400 mr-2" />}
                                />
                            </Form.Item>

                            <Form.Item
                                name="gender"
                                label={
                                    <span className="text-gray-600 font-medium">Giới tính</span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select
                                    className="h-11 rounded-lg"
                                    placeholder="Chọn giới tính"
                                    options={[
                                        { value: 'MALE', label: 'Nam' },
                                        { value: 'FEMALE', label: 'Nữ' }
                                    ]}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="address"
                            label={
                                <span className="text-gray-600 font-medium">Địa chỉ</span>
                            }
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Nhập địa chỉ"
                                className="rounded-lg"
                            />
                        </Form.Item>
                    </div>

                    {/* Role & Company Section */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-gray-700 font-medium mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-500" />
                            Thông tin vai trò
                        </h3>
                        <div className="space-y-4">
                            <Form.Item
                                name="role"
                                label={
                                    <span className="text-gray-600 font-medium">Vai trò</span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng chọn vai trò!' },
                                    { pattern: /^[0-9a-fA-F]{24}$/, message: 'Role có định dạng là mongo id' }
                                ]}
                            >
                                <Select
                                    placeholder="Chọn vai trò"
                                    loading={formLoading}
                                    showSearch
                                    className="rounded-lg"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={roles.map(role => ({
                                        value: role._id,
                                        label: role.name
                                    }))}
                                    onChange={(value) => {
                                        setSelectedRole(value);
                                        if (value !== '67566b60671f5436a0de69a5') {
                                            form.setFieldsValue({ company: undefined });
                                        }
                                    }}
                                />
                            </Form.Item>

                            {selectedRole === '67566b60671f5436a0de69a5' && (
                                <Form.Item
                                    name="company"
                                    label={
                                        <span className="text-gray-600 font-medium">Công ty</span>
                                    }
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn công ty!' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Tìm kiếm và chọn công ty"
                                        loading={companyLoading}
                                        className="rounded-lg"
                                        filterOption={false}
                                        onSearch={debouncedSearch}
                                        options={companies}
                                        notFoundContent={companyLoading ? <Spin size="small" /> : null}
                                    />
                                </Form.Item>
                            )}
                        </div>
                    </div>

                    <Form.Item className="mb-0 flex justify-end pt-4">
                        <Space size="middle">
                            <Button
                                onClick={() => {
                                    onCancel();
                                    form.resetFields();
                                }}
                                className="h-11 px-6 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-300"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="h-11 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 border-none flex items-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default EditUserModal;