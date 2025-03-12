import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Select, InputNumber, DatePicker, Switch, Modal, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapPin, Users, Briefcase, Building2, BanknoteIcon, Power, Code, Calendar, FileText, } from 'lucide-react';
import dayjs from 'dayjs';
import './AddEditJobModal.style.css';
import CustomButton from '../../../components/Other/CustomButton';
import { formats, modules } from '../../../config/reactQuillConfig';
import { skillApi } from '../../../api/skillAPI';

const { Option } = Select;

const AddEditJobModal = ({ isOpen, onClose, mode, jobData, onSubmit }) => {
    const [form] = Form.useForm();
    const { user } = useSelector((state) => state.auth);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await skillApi.getAll({
                    current: 1,
                    pageSize: 100
                });
                setSkills(response?.data?.result);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        fetchSkills();
    }, []);

    React.useEffect(() => {
        if (jobData && mode === 'edit') {
            form.setFieldsValue({
                name: jobData.name,
                company: jobData.company._id,
                skills: jobData.skills?.map(skill => skill._id),
                location: jobData.location,
                level: jobData.level,
                quantity: jobData.quantity,
                salary: jobData.salary,
                description: jobData.description,
                startDate: jobData.startDate ? dayjs(jobData.startDate) : null,
                endDate: jobData.endDate ? dayjs(jobData.endDate) : null,
                isActive: jobData.isActive
            });
        } else {
            form.resetFields();
        }
    }, [jobData, mode, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const submissionData = {
                name: values.name,
                skills: values.skills,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: values.description,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
                isActive: values.isActive,
                location: values.location
            };

            await onSubmit(submissionData);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const renderLabel = (icon, label) => (
        <div className="icon-wrapper">
            {icon}
            <span>{label}</span>
        </div>
    );

    const disabledStartDate = (current) => {
        const endDate = form.getFieldValue('endDate');
        if (!current || !endDate) return false;
        return current.isAfter(endDate, 'day');
    };

    const disabledEndDate = (current) => {
        const startDate = form.getFieldValue('startDate');
        if (!current || !startDate) return false;
        return current.isBefore(startDate, 'day');
    };

    return (
        <Modal
            title={renderLabel(
                <Briefcase className="text-blue-600" />,
                mode === 'add' ? 'Thêm việc làm mới' : 'Chỉnh sửa việc làm'
            )}
            open={isOpen}
            onCancel={onClose}
            onOk={handleSubmit}
            width={900}
            style={{ top: 40 }}
            className="custom-modal"
            okText={mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            cancelText="Hủy"
            closeIcon={null}
            bodyStyle={{
                padding: '24px',
                maxHeight: 'calc(100vh - 230px)',
                overflow: 'auto',
            }}
            footer={[
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '10px', alignItems: 'center' }}>
                    <Button
                        onClick={onClose}
                        size="large"
                        className="px-6 py-2 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300"
                        style={{ height: '45px' }}
                    >
                        Huỷ
                    </Button>

                    <CustomButton
                        key="submit"
                        htmlType="submit"
                        onClick={handleSubmit}
                        style={{ height: '45px' }}
                    >
                        {mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                    </CustomButton>
                </div>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                className="custom-form"
                initialValues={{
                    quantity: 1,
                    isActive: true,
                }}
            >
                <div>
                    <Form.Item
                        name="name"
                        label={renderLabel(<Briefcase />, "Tên công việc")}
                        rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
                    >
                        <Input placeholder="Nhập tên công việc" />
                    </Form.Item>

                    <Form.Item
                        name="skills"
                        label={renderLabel(<Code />, "Kỹ năng")}
                        rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn kỹ năng"
                            style={{
                                width: '100%'
                            }}
                            className="custom-select"
                            optionFilterProp="children"
                            showSearch
                            maxTagCount={5}
                            maxTagTextLength={20}
                            listHeight={200}
                            dropdownStyle={{ padding: '8px' }}
                        >
                            {skills.map((skill) => (
                                <Option key={skill._id} value={skill._id}>
                                    {skill.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="location"
                            label={renderLabel(<MapPin />, "Địa điểm")}
                            rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                        >
                            <Select placeholder="Chọn địa điểm">
                                <Option value="HANOI">Hà Nội</Option>
                                <Option value="HOCHIMINH">Hồ Chí Minh</Option>
                                <Option value="DANANG">Đà Nẵng</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="level"
                            label={renderLabel(<Building2 />, "Thời gian làm việc")}
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                        >
                            <Select placeholder="Chọn thời gian">
                                <Option value="FULLTIME">Toàn thời gian</Option>
                                <Option value="PARTTIME">Bán thời gian</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="quantity"
                            label={renderLabel(<Users />, "Số lượng")}
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        >
                            <InputNumber
                                min={1}
                                placeholder="Nhập số lượng"
                                className="w-full"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="salary"
                            label={renderLabel(<BanknoteIcon />, "Mức lương")}
                            rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
                        >
                            <InputNumber
                                min={0}
                                className="w-full"
                                placeholder="Nhập mức lương"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="startDate"
                            label={renderLabel(<Calendar />, "Ngày bắt đầu")}
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                        >
                            <DatePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                                disabledDate={disabledStartDate}
                                placeholder="Chọn ngày bắt đầu"
                                disabled={mode === 'edit'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="endDate"
                            label={renderLabel(<Calendar />, "Ngày kết thúc")}
                            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                        >
                            <DatePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                                disabledDate={disabledEndDate}
                                placeholder="Chọn ngày kết thúc"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label={renderLabel(<FileText />, "Mô tả công việc")}
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc!' }]}
                    >
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            className="h-64"
                            placeholder="Nhập mô tả chi tiết về công việc"
                        />
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label={renderLabel(<Power />, "Trạng thái")}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Đang tuyển"
                            unCheckedChildren="Đã đóng"
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default AddEditJobModal;