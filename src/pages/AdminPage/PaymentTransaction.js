import React, { useState, useEffect, useCallback } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Input, Select, Button, Tag, Layout, Form, Typography, Space, Tooltip, DatePicker } from 'antd';
import { paymentApi } from '../../api/paymentAPI';
import Sidebar from '../../components/AdminPage/Sidebar';
import AdminHeader from '../../components/AdminPage/Header';
import { userApi } from '../../api/AdminPageAPI/userAPI';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const PaymentTransaction = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState({});
    const [searchParams, setSearchParams] = useState({
        orderId: '',
        status: undefined,
        bankCode: '',
        paymentMonth: undefined
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
            align: 'center'
        },
        {
            title: 'Email',
            dataIndex: 'userId',
            key: 'email',
            width: 250,
            ellipsis: {
                showTitle: false
            },
            align: 'center',
            render: (userId) => {
                const user = users[userId];
                const email = user?.email || 'N/A';
                return (
                    <Tooltip placement="topLeft" title={email}>
                        <span className="text-gray-700">{email}</span>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'orderId',
            key: 'orderId',
            align: 'center',
            width: 120
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            align: 'center',
            render: (text) => (
                <span className="text-blue-600 font-medium">{text}</span>
            )
        },
        {
            title: 'Nội dung',
            dataIndex: 'info',
            key: 'info',
            width: 200,
            ellipsis: true
        },
        {
            title: 'Phương thức',
            dataIndex: 'method',
            key: 'method',
            width: 120,
            align: 'center'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => {
                let color;
                let text;
    
                switch (status) {
                    case 'success':
                        color = 'success';
                        text = 'Thành công';
                        break;
                    case 'pending':
                        color = 'warning';
                        text = 'Đang xử lý';
                        break;
                    case 'failed':
                        color = 'error';
                        text = 'Thất bại';
                        break;
                    default:
                        color = 'default';
                        text = status;
                }
    
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thời gian thanh toán',
            dataIndex: 'paymentTime',
            key: 'paymentTime',
            width: 150
        }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchUsers = async () => {
        try {
            const response = await userApi.getAll({
                current: 1,
                pageSize: 100 
            });
            
            const usersMap = response.data.result.reduce((acc, user) => {
                acc[user._id] = {
                    email: user.email
                };
                return acc;
            }, {});

            setUsers(usersMap);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTransactions = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const apiParams = {
                current: params.current || pagination.current,
                pageSize: params.pageSize || pagination.pageSize,
            };
    
            if (params.orderId || searchParams.orderId) {
                apiParams.orderId = params.orderId || searchParams.orderId;
            }
            if (params.status || searchParams.status) {
                apiParams.status = params.status || searchParams.status;
            }
            if (params.bankCode || searchParams.bankCode) {
                apiParams.bankCode = params.bankCode || searchParams.bankCode;
            }

            // Xử lý tháng năm
            if (params.paymentMonth || searchParams.paymentMonth) {
                const date = dayjs(params.paymentMonth || searchParams.paymentMonth);
                apiParams.month = date.month() + 1;
                apiParams.year = date.year();
            }
    
            if (params.sortField && params.sortOrder) {
                apiParams.sort = `${params.sortField},${params.sortOrder === 'descend' ? -1 : 1}`;
            }
    
            const response = await paymentApi.getAll(apiParams);
    
            const { result, meta } = response.data.data;
    
            const formattedTransactions = result.map((transaction, index) => ({
                key: transaction._id,
                stt: index + 1 + ((meta.current - 1) * meta.pageSize),
                orderId: transaction.orderId,
                amount: new Intl.NumberFormat('vi-VN').format(transaction.amount) + ' đ',
                info: transaction.orderInfo,
                method: transaction.bankCode || 'N/A',
                status: transaction.status,
                bankTranNo: transaction.bankTranNo || 'N/A',
                responseCode: transaction.responseCode || 'N/A',
                transactionNo: transaction.transactionNo || 'N/A',
                createdAt: formatDate(transaction.createdAt),
                paymentTime: formatDate(transaction.paymentTime),
                userId: transaction.userId
            }));
    
            setTransactions(formattedTransactions);
            setPagination({
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, searchParams]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = () => {
        fetchTransactions({
            ...searchParams,
            current: 1
        });
    };

    const handleReset = () => {
        setSearchParams({
            orderId: '',
            status: undefined,
            bankCode: '',
            paymentMonth: undefined
        });
        fetchTransactions({
            current: 1,
            pageSize: pagination.pageSize,
        });
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        fetchTransactions({
            ...newPagination,
            ...searchParams,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    const handleRefresh = () => {
        fetchTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    return (
        <Layout className="min-h-screen">
            <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'} flex-shrink-0`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            <Layout>
                <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

                <Content className="m-6">
                    {/* Search Form */}
                    <div className="bg-white p-4 shadow rounded-lg mb-6">
                        <Form
                            layout="vertical"
                            className="ml-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Form.Item label="Mã giao dịch" className="col-span-1">
                                    <Input
                                        placeholder="Nhập mã giao dịch"
                                        value={searchParams.orderId}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, orderId: e.target.value }))}
                                        style={{ height: '40px' }}
                                        prefix={<Search className="w-4 h-4 text-gray-400" />}
                                    />
                                </Form.Item>

                                <Form.Item label="Trạng thái" className="col-span-1">
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        allowClear
                                        showSearch={false}
                                        style={{ width: '100%', height: '40px' }}
                                        value={searchParams.status}
                                        onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
                                    >
                                        <Option value="success">Thành công</Option>
                                        <Option value="pending">Đang xử lý</Option>
                                        <Option value="failed">Thất bại</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Thời gian thanh toán" className="col-span-1">
                                    <DatePicker
                                        picker="month"
                                        placeholder="Chọn tháng"
                                        style={{ width: '100%', height: '40px' }}
                                        format="MM/YYYY"
                                        locale={locale}
                                        allowClear
                                        value={searchParams.paymentMonth ? dayjs(searchParams.paymentMonth) : null}
                                        onChange={(date) => {
                                            setSearchParams(prev => ({ ...prev, paymentMonth: date }));
                                            fetchTransactions({ ...searchParams, paymentMonth: date, current: 1 });
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item className="col-span-1" label=" ">
                                    <Button
                                        onClick={handleReset}
                                        className="w-50"
                                        style={{ height: '40px' }}
                                        icon={<RotateCcw className="w-4 h-4" />}
                                    >
                                        Đặt lại
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                                DANH SÁCH GIAO DỊCH
                            </Title>
                            <Space>
                                <Tooltip title="Làm mới">
                                    <Button
                                        icon={<RotateCcw className="w-4 h-4" />}
                                        onClick={handleRefresh}
                                        size="large"
                                        style={{
                                            height: '44px',
                                            width: '44px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    />
                                </Tooltip>
                            </Space>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={transactions}
                            loading={loading}
                            onChange={handleTableChange}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                            }}
                            bordered
                            size="middle"
                            className="overflow-x-auto"
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default PaymentTransaction;