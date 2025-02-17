import React from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Switch, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapPin, Users, Briefcase, Building2, BanknoteIcon, Power, Code, Calendar, FileText, } from 'lucide-react';
import dayjs from 'dayjs';
import './AddEditJobModal.style.css';

const { Option } = Select;

const AddEditJobModal = ({ isOpen, onClose, mode, jobData, onSubmit }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (jobData && mode === 'edit') {
            form.setFieldsValue({
                name: jobData.name,
                company: jobData.company._id,
                skills: jobData.skills?.join(', '),
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
                ...values,
                skills: values.skills.split(',').map(skill => skill.trim().toUpperCase()),
                startDate: values.startDate?.toDate(),
                endDate: values.endDate?.toDate(),
            };
            onSubmit(submissionData);
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

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'color',
        'background', 
    ];

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }],
            [{ 'background': [] }],
            ['clean']
        ]
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
            width={830}
            className="custom-modal"
            okText={mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            cancelText="Hủy"
            bodyStyle={{ 
                padding: '24px',
                maxHeight: 'calc(100vh - 270px)', 
                overflow: 'auto',
            }}            
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
                        rules={[{ required: true, message: 'Vui lòng nhập kỹ năng!' }]}
                    >
                        <Input placeholder="VD: REACT, JAVASCRIPT, NODEJS (phân cách bởi dấu phẩy)" />
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
                                <Option value="PARTTIME">Bán thời gian</Option>
                                <Option value="FULLTIME">Toàn thời gian</Option>
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