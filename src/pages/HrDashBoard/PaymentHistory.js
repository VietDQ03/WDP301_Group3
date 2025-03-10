import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { Table, Input, Button, Space, Form, Typography, Layout, Select, Tag, message, Pagination, DatePicker } from "antd";
import { Search, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useSelector } from "react-redux";
import AlertComponent from '../../components/Other/AlertComponent';
import { paymentApi } from "../../api/paymentAPI";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const PaymentHistory = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [searchParams, setSearchParams] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const { user } = useSelector((state) => state.auth);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    const debouncedSearch = useCallback(
        debounce((params) => {
            fetchPayments(params);
        }, 500),
        []
    );

    const fetchPayments = async (params = {}) => {
        setLoading(true);
        try {
            const apiParams = {
                ...params,
                current: params.current || pagination.current,
                pageSize: params.pageSize || pagination.pageSize,
            };

            if (params.paymentMonth) {
                const date = dayjs(params.paymentMonth);
                apiParams.month = date.month() + 1; // Tháng trong dayjs bắt đầu từ 0
                apiParams.year = date.year();
                delete apiParams.paymentMonth;
            }

            const response = await paymentApi.findByUserId(user?._id, apiParams);

            const { result, meta } = response.data.data;

            const formattedPayments = result.map((payment, index) => ({
                key: payment._id,
                stt: ((meta.current - 1) * meta.pageSize) + index + 1,
                orderId: payment.orderId,
                amount: new Intl.NumberFormat('vi-VN').format(payment.amount) + ' đ',
                orderInfo: payment.orderInfo,
                status: payment.status,
                bankCode: payment.bankCode || 'N/A',
                bankTranNo: payment.bankTranNo || 'N/A',
                paymentTime: formatDate(payment.paymentTime),
                createdAt: formatDate(payment.createdAt),
            }));

            setPayments(formattedPayments);
            setPagination({
                ...pagination,
                total: meta.total,
                current: meta.current,
                pageSize: meta.pageSize,
            });
        } catch (error) {
            console.error("Error fetching payments:", error);
            message.error("Có lỗi xảy ra khi tải lịch sử thanh toán!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 80,
            align: "center",
            render: (text) => (
                <span className="text-gray-500">{text}</span>
            )
        },
        {
            title: "Mã giao dịch",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => (
                <div className="font-medium text-gray-800">{text}</div>
            )
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: (text) => (
                <div className="font-medium text-blue-600">{text}</div>
            )
        },
        {
            title: "Nội dung",
            dataIndex: "orderInfo",
            key: "orderInfo",
            render: (text) => (
                <div className="text-gray-600">{text}</div>
            )
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "bankCode",
            key: "bankCode",
            align: "center",
            render: (text) => (
                <div className="text-gray-600">{text}</div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => {
                const statusConfig = {
                    success: { color: 'green', text: 'Thành công' },
                    pending: { color: 'gold', text: 'Đang xử lý' },
                    failed: { color: 'red', text: 'Thất bại' }
                };

                return (
                    <Tag color={statusConfig[status].color} className="px-3 py-1">
                        {statusConfig[status].text}
                    </Tag>
                );
            }
        },
        {
            title: "Thời gian thanh toán",
            dataIndex: "paymentTime",
            key: "paymentTime",
            render: (text) => (
                <div className="text-gray-600">{text}</div>
            )
        }
    ];

    const handleTableChange = (newPagination, filters, sorter) => {
        const params = {
            ...searchParams,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        };

        fetchPayments(params);
    };

    const onReset = () => {
        form.resetFields();
        setSearchParams({});
        fetchPayments({
            current: 1,
            pageSize: pagination.pageSize
        });
    };

    const handleRefresh = () => {
        fetchPayments({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    return (
        <Layout className="min-h-screen flex flex-row">
            <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'} flex-shrink-0`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            <div className="flex-1">
                <Layout>
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Content className="m-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Page Header */}
                            <div className="mb-6">
                                <motion.h1
                                    className="text-2xl font-bold text-gray-800"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Lịch sử thanh toán
                                </motion.h1>
                                <motion.p
                                    className="text-gray-500 mt-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Xem lịch sử các giao dịch thanh toán
                                </motion.p>
                            </div>

                            {/* Search Section */}
                            <motion.div
                                className="bg-white p-6 shadow-sm rounded-xl mb-6 border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    className="space-y-4"
                                    onValuesChange={(changedValues, allValues) => {
                                        const searchParams = {
                                            ...allValues,
                                            current: 1,
                                            orderId: allValues.orderId?.trim() || undefined,
                                            status: allValues.status || undefined,
                                            paymentMonth: allValues.paymentMonth ? dayjs(allValues.paymentMonth) : undefined,
                                            orderInfo: allValues.orderInfo?.trim() || undefined,
                                        };
                                        setSearchParams(searchParams);
                                        debouncedSearch(searchParams);
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                        <div>
                                            <label className="text-gray-700 font-medium mb-2 block">Mã giao dịch</label>
                                            <Form.Item name="orderId" className="mb-0">
                                                <Input
                                                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                                                    placeholder="Nhập mã giao dịch"
                                                    className="h-11 rounded-lg"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div>
                                            <label className="text-gray-700 font-medium mb-2 block">Nội dung</label>
                                            <Form.Item name="orderInfo" className="mb-0">
                                                <Input
                                                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                                                    placeholder="Nhập nội dung"
                                                    className="h-11 rounded-lg"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div>
                                            <label className="text-gray-700 font-medium mb-2 block">Thời gian thanh toán</label>
                                            <Form.Item name="paymentMonth" className="mb-0">
                                                <DatePicker
                                                    picker="month"
                                                    placeholder="Chọn tháng"
                                                    className="h-11 w-full rounded-lg"
                                                    format="MM/YYYY"
                                                    locale={locale}
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </div>

                                        <div>
                                            <label className="text-gray-700 font-medium mb-2 block">Trạng thái</label>
                                            <Form.Item name="status" className="mb-0">
                                                <Select
                                                    placeholder="Chọn trạng thái"
                                                    className="h-11 w-full"
                                                    allowClear
                                                >
                                                    <Option value="success">Thành công</Option>
                                                    <Option value="pending">Đang xử lý</Option>
                                                    <Option value="failed">Thất bại</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>

                                        <div className="flex items-end gap-2">
                                            <Button
                                                onClick={onReset}
                                                size="large"
                                                className="h-11 px-6 flex items-center"
                                                icon={<RotateCcw className="w-4 h-4" />}
                                            >
                                                Đặt lại
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </motion.div>

                            {/* List Section */}
                            <motion.div
                                className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 relative"
                                style={{ minHeight: '600px' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <Title level={4} className="!text-xl !mb-1">Danh sách giao dịch</Title>
                                        <p className="text-gray-500 text-sm">
                                            Hiển thị {payments.length} trên tổng số {pagination.total} giao dịch
                                        </p>
                                    </div>
                                    <Space size="middle">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                icon={<RotateCcw className="w-4 h-4" />}
                                                onClick={handleRefresh}
                                                size="large"
                                                className="h-11 hover:bg-gray-50 hover:border-gray-300"
                                            >
                                                Làm mới
                                            </Button>
                                        </motion.div>
                                    </Space>
                                </div>

                                <div className="pb-16">
                                    <Table
                                        dataSource={payments}
                                        columns={columns}
                                        pagination={false}
                                        bordered={false}
                                        size="middle"
                                        className="shadow-sm rounded-lg overflow-hidden"
                                        loading={loading}
                                        rowClassName={() => 'hover:bg-gray-50 transition-colors'}
                                    />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
                                    <div className="flex justify-end">
                                        <Pagination
                                            {...pagination}
                                            showSizeChanger
                                            onChange={(page, pageSize) => {
                                                handleTableChange({ current: page, pageSize }, {}, {});
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Content>
                </Layout>
            </div>
        </Layout>
    );
};

export default PaymentHistory;