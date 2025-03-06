import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import CustomButton from '../../../components/Other/CustomButton';

const { Option } = Select;

const AddEditPermissionModal = ({
    visible,
    onCancel,
    onOk,
    editingPermission,
    form
}) => {
    return (
        <Modal
            title={
                <div className="text-lg font-semibold border-b pb-3">
                    {editingPermission ? "Sửa Quyền" : "Thêm Quyền Mới"}
                </div>
            }
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            width={800}
            className="permission-modal"
            footer={
                <div className="flex items-center justify-end">
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        className="h-11 px-6 flex items-center justify-center"
                    >
                        Hủy
                    </Button>
                    <CustomButton
                        key="submit"
                        onClick={onOk}
                        className="min-w-[100px] ml-3"
                    >
                        {editingPermission ? "Cập nhật" : "Thêm mới"}
                    </CustomButton>
                </div>
            }
            centered
        >
            <div className="mt-6">
                <Form
                    form={form}
                    layout="vertical"
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Tên Quyền"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên quyền!' },
                                { max: 100, message: 'Tên quyền không được vượt quá 100 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên quyền"
                                className="h-10 rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="apiPath"
                            label="API Path"
                            rules={[
                                { required: true, message: 'Vui lòng nhập API path!' },
                                { max: 200, message: 'API path không được vượt quá 200 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập API path"
                                className="h-10 rounded-md"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="method"
                            label="Phương Thức"
                            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                        >
                            <Select
                                placeholder="Chọn phương thức"
                                className="h-10 rounded-md"
                            >
                                <Option value="GET">
                                    <span className="text-blue-500">GET</span>
                                </Option>
                                <Option value="POST">
                                    <span className="text-green-500">POST</span>
                                </Option>
                                <Option value="PATCH">
                                    <span className="text-orange-500">PATCH</span>
                                </Option>
                                <Option value="DELETE">
                                    <span className="text-red-500">DELETE</span>
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="module"
                            label="Module"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên module!' },
                                { max: 50, message: 'Tên module không được vượt quá 50 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên module"
                                className="h-10 rounded-md"
                            />
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddEditPermissionModal;