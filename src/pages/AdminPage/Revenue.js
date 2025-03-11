import React, { useState, useEffect, useCallback } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Layout, DatePicker, Form, Button } from 'antd';
import { paymentApi } from '../../api/paymentAPI';
import dayjs from 'dayjs';
import Sidebar from '../../components/AdminPage/Sidebar';
import AdminHeader from '../../components/AdminPage/Header';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Content } = Layout;

const Revenue = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewMode, setViewMode] = useState('all');
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        monthlyRevenue: [],
        dailyRevenue: [],
        successCount: 0,
        pendingCount: 0,
        failedCount: 0,
        totalCount: 0,
        currentMonthStats: {
            revenue: 0,
            successCount: 0,
            totalCount: 0
        },
        previousMonthStats: {
            revenue: 0,
            successCount: 0,
            totalCount: 0
        },
        revenueGrowth: 0,
        successRateGrowth: 0,
        transactionGrowth: 0
    });

    const handleDateChange = (date) => {
        setSelectedDate(date || dayjs());
    };

    const fetchAllPayments = async () => {
        try {
            const response = await paymentApi.getAll({
                pageSize: 1000,
                current: 1
            });

            const transactions = response?.data?.data?.result;
            if (!transactions) return;

            let filteredTransactions;
            let previousMonthTransactions;

            if (viewMode === 'month') {
                // Lọc theo tháng đã chọn
                filteredTransactions = transactions.filter(transaction => {
                    const transactionDate = dayjs(transaction.paymentTime || transaction.createdAt);
                    return transactionDate.month() === selectedDate.month() &&
                        transactionDate.year() === selectedDate.year();
                });

                previousMonthTransactions = transactions.filter(transaction => {
                    const transactionDate = dayjs(transaction.paymentTime || transaction.createdAt);
                    return transactionDate.month() === selectedDate.subtract(1, 'month').month() &&
                        transactionDate.year() === selectedDate.subtract(1, 'month').year();
                });
            } else {
                // Xem tất cả
                filteredTransactions = transactions;

                // Lấy tháng hiện tại cho thống kê so sánh
                const currentMonth = dayjs().month();
                const currentYear = dayjs().year();

                previousMonthTransactions = transactions.filter(transaction => {
                    const transactionDate = dayjs(transaction.paymentTime || transaction.createdAt);
                    return transactionDate.month() === dayjs().subtract(1, 'month').month() &&
                        transactionDate.year() === dayjs().subtract(1, 'month').year();
                });
            }

            // Thống kê cho thời gian được chọn
            const currentMonthStats = {
                revenue: 0,
                successCount: 0,
                totalCount: 0
            };

            const previousMonthStats = {
                revenue: 0,
                successCount: 0,
                totalCount: 0
            };

            // Thống kê tổng
            const stats = filteredTransactions.reduce((acc, transaction) => {
                acc[`${transaction.status}Count`]++;
                acc.totalCount++;

                if (transaction.status === 'success') {
                    acc.totalRevenue += Number(transaction.amount);

                    if (viewMode === 'month') {
                        currentMonthStats.revenue += Number(transaction.amount);
                        currentMonthStats.successCount++;
                    }
                }
                if (viewMode === 'month') {
                    currentMonthStats.totalCount++;
                }

                return acc;
            }, {
                successCount: 0,
                pendingCount: 0,
                failedCount: 0,
                totalCount: 0,
                totalRevenue: 0
            });

            // Thống kê cho tháng trước nếu đang xem theo tháng
            if (viewMode === 'month') {
                previousMonthTransactions.forEach(transaction => {
                    if (transaction.status === 'success') {
                        previousMonthStats.revenue += Number(transaction.amount);
                        previousMonthStats.successCount++;
                    }
                    previousMonthStats.totalCount++;
                });
            }

            // Tính doanh thu theo tháng cho tất cả thời gian
            const monthlyData = {};
            transactions.forEach(transaction => {
                if (transaction.status === 'success' && transaction.paymentTime) {
                    const month = dayjs(transaction.paymentTime).format('MM/YYYY');
                    monthlyData[month] = (monthlyData[month] || 0) + Number(transaction.amount);
                }
            });

            const monthlyRevenue = Object.entries(monthlyData)
                .map(([month, revenue]) => ({
                    name: month,
                    revenue: revenue
                }))
                .sort((a, b) => dayjs(a.name, 'MM/YYYY').diff(dayjs(b.name, 'MM/YYYY')));

            // Tính doanh thu theo ngày
            const dailyData = {};
            let daysArray;

            if (viewMode === 'month') {
                // Nếu xem theo tháng, hiển thị các ngày trong tháng đó
                const daysInMonth = selectedDate.daysInMonth();
                daysArray = Array.from({ length: daysInMonth }, (_, i) =>
                    selectedDate.startOf('month').add(i, 'day').format('DD/MM')
                );
            } else {
                // Nếu xem tất cả, hiển thị 30 ngày gần nhất
                daysArray = Array.from({ length: 30 }, (_, i) =>
                    dayjs().subtract(i, 'day').format('DD/MM')
                ).reverse();
            }

            filteredTransactions.forEach(transaction => {
                if (transaction.status === 'success' && transaction.paymentTime) {
                    const day = dayjs(transaction.paymentTime).format('DD/MM');
                    dailyData[day] = (dailyData[day] || 0) + Number(transaction.amount);
                }
            });

            const dailyRevenue = daysArray.map(day => ({
                name: day,
                revenue: dailyData[day] || 0
            }));

            // Tính % thay đổi
            const revenueGrowth = previousMonthStats.revenue > 0
                ? ((currentMonthStats.revenue - previousMonthStats.revenue) / previousMonthStats.revenue * 100)
                : 0;

            setRevenueData({
                ...stats,
                monthlyRevenue,
                dailyRevenue,
                currentMonthStats,
                previousMonthStats,
                revenueGrowth
            });

        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAllPayments().finally(() => setLoading(false));
    }, [selectedDate, viewMode]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const getStats = () => {
        if (viewMode === 'all') {
            return [
                {
                    name: 'Tổng doanh thu',
                    value: formatCurrency(revenueData.totalRevenue),
                    change: null,
                    changeType: 'increase'
                },
                {
                    name: 'Doanh thu trung bình/tháng',
                    value: formatCurrency(revenueData.monthlyRevenue?.length > 0
                        ? revenueData.totalRevenue / revenueData.monthlyRevenue.length
                        : 0),
                    change: null,
                    changeType: 'increase'
                },
                {
                    name: 'Doanh thu trung bình/ngày',
                    value: formatCurrency(revenueData.monthlyRevenue?.length > 0
                        ? revenueData.totalRevenue / (revenueData.monthlyRevenue.length * 30)
                        : 0),
                    change: null,
                    changeType: 'increase'
                }
            ];
        } else {
            return [
                {
                    name: 'Tổng doanh thu',
                    value: formatCurrency(revenueData.totalRevenue),
                    change: null,
                    changeType: 'increase'
                },
                {
                    name: 'Doanh thu trung bình/ngày',
                    value: formatCurrency(revenueData.currentMonthStats.revenue / selectedDate.daysInMonth()),
                    change: revenueData.previousMonthStats.revenue > 0
                        ? `${(((revenueData.currentMonthStats.revenue / selectedDate.daysInMonth()) -
                            (revenueData.previousMonthStats.revenue / selectedDate.subtract(1, 'month').daysInMonth())) /
                            (revenueData.previousMonthStats.revenue / selectedDate.subtract(1, 'month').daysInMonth()) * 100).toFixed(1)}%`
                        : '0%',
                    changeType: (revenueData.currentMonthStats.revenue / selectedDate.daysInMonth()) >=
                        (revenueData.previousMonthStats.revenue / selectedDate.subtract(1, 'month').daysInMonth())
                        ? 'increase' : 'decrease'
                }
            ];
        }
    };

    return (
        <Layout className="min-h-screen">
            <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'} flex-shrink-0`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            <Layout>
                <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

                <Content className="m-6">
                    {/* Filter Section */}
                    <div className="bg-white p-6 shadow rounded-lg mb-6">
                        <Form layout="inline" className="mb-4">
                            <Form.Item>
                                <Button.Group>
                                    <Button
                                        type={viewMode === 'all' ? 'primary' : 'default'}
                                        onClick={() => setViewMode('all')}
                                    >
                                        Tất cả thời gian
                                    </Button>
                                    <Button
                                        type={viewMode === 'month' ? 'primary' : 'default'}
                                        onClick={() => setViewMode('month')}
                                    >
                                        Theo tháng
                                    </Button>
                                </Button.Group>
                            </Form.Item>
                            {viewMode === 'month' && (
                                <>
                                    <Form.Item label="Chọn tháng">
                                        <DatePicker
                                            picker="month"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            format="MM/YYYY"
                                            allowClear={false}
                                            locale={locale}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            onClick={() => setSelectedDate(dayjs())}
                                            icon={<RotateCcw className="w-4 h-4" />}
                                        >
                                            Đặt lại
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Stats Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${viewMode === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 mb-8`}>
                        {getStats().map((stat) => (
                            <motion.div
                                key={stat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="text-sm text-gray-500">{stat.name}</div>
                                <div className="mt-2 flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {stat.value}
                                    </div>
                                    {stat.change && (
                                        <div className={`ml-2 text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Transaction Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow p-6 mb-6"
                    >
                        <h3 className="text-lg font-semibold mb-4">Phân bố trạng thái giao dịch</h3>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-green-100 rounded-lg p-4">
                                <div className="text-green-600 text-sm">Thành công</div>
                                <div className="text-2xl font-semibold">{revenueData.successCount}</div>
                            </div>
                            <div className="flex-1 bg-yellow-100 rounded-lg p-4">
                                <div className="text-yellow-600 text-sm">Đang xử lý</div>
                                <div className="text-2xl font-semibold">{revenueData.pendingCount}</div>
                            </div>
                            <div className="flex-1 bg-red-100 rounded-lg p-4">
                                <div className="text-red-600 text-sm">Thất bại</div>
                                <div className="text-2xl font-semibold">{revenueData.failedCount}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Revenue Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData.monthlyRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            tickFormatter={(value) =>
                                                new Intl.NumberFormat('vi-VN', {
                                                    notation: 'compact',
                                                    compactDisplay: 'short'
                                                }).format(value)
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                        />
                                        <Legend />
                                        <Bar dataKey="revenue" fill="#3B82F6" name="Doanh thu" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Daily Revenue Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4">Doanh thu theo ngày trong tháng</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData.dailyRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            tickFormatter={(value) =>
                                                new Intl.NumberFormat('vi-VN', {
                                                    notation: 'compact',
                                                    compactDisplay: 'short'
                                                }).format(value)
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3B82F6"
                                            name="Doanh thu"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Revenue;