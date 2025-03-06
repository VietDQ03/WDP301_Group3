import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, message, Button, Space } from 'antd';
import { roleApi } from '../../../api/AdminPageAPI/roleAPI';
import { permissionApi } from '../../../api/AdminPageAPI/permissionsAPI';
import CustomButton from '../../../components/Other/CustomButton';

const { TextArea } = Input;

const AddEditRoleModal = ({
    open,
    onCancel,
    onSuccess,
    editData = null,
    permissions = {}
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [allPermissions, setAllPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    const isEditMode = !!editData;

    useEffect(() => {
        if (open) {
            fetchAllPermissions();
            if (isEditMode) {
                form.setFieldsValue({
                    name: editData.name,
                    permissions: editData.permissions,
                    description: editData.description,
                    isActive: editData.isActive
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editData, form]);

    const fetchAllPermissions = async () => {
        try {
            setLoadingPermissions(true);
            const response = await permissionApi.getAll({
                current: 1,
                pageSize: 1000,
            });

            if (response?.data?.result) {
                const formattedPermissions = response.data.result.map(permission => ({
                    _id: permission._id,
                    name: permission.name || permission.code || 'Chưa đặt tên'
                }));
                setAllPermissions(formattedPermissions);
            }
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            message.error('Không thể tải danh sách quyền');
        } finally {
            setLoadingPermissions(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (isEditMode) {
                await roleApi.update(editData._id, values);
                message.success('Cập nhật vai trò thành công');
            } else {
                await roleApi.create(values);
                message.success('Thêm mới vai trò thành công');
            }

            onSuccess();
            onCancel();
            form.resetFields();
        } catch (error) {
            console.error('Failed to submit role:', error);
            message.error(isEditMode ? 'Không thể cập nhật vai trò' : 'Không thể thêm mới vai trò');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={isEditMode ? "Sửa Vai Trò" : "Thêm Vai Trò"}
            open={open}
            onCancel={onCancel}
            footer={
                <Space size="small">
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        size="large"
                        style={{
                            height: '44px',
                            width: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Hủy
                    </Button>
                    <CustomButton
                        key="submit"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                    </CustomButton>
                </Space>
            }
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    isActive: true
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên vai trò"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên vai trò' },
                        { max: 100, message: 'Tên vai trò không được vượt quá 100 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập tên vai trò" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        {required: true, message: 'Vui lòng nhập mô tả vai trò'},
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả vai trò"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                </Form.Item>

                <Form.Item
                    name="permissions"
                    label="Quyền hạn"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ít nhất một quyền hạn' }
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn quyền hạn"
                        loading={loadingPermissions}
                        optionFilterProp="label"
                        showSearch
                    >
                        {allPermissions.map(permission => (
                            <Select.Option
                                key={permission._id}
                                value={permission._id}
                                label={permission.name}
                            >
                                {permission.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Trạng thái"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Đang hoạt động"
                        unCheckedChildren="Ngừng hoạt động"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditRoleModal;