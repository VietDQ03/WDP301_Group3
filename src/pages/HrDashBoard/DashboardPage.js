import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Sidebar from '../../components/HrDashBoard/Sidebar';
import Header from '../../components/HrDashBoard/Header';
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";

const { Content } = Layout;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [dataCompanies, setDataCompanies] = useState([]);
  const [dataJobs, setDataJobs] = useState([]);
  const [dataResumes, setDataResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const [companiesResponse, jobsResponse, resumeResponse] = await Promise.all([
        companyApi.getAll({ ...params }),
        jobApi.getAll({ ...params }),
        resumeApi.getAll({ ...params })
      ]);

      if (companiesResponse?.data?.data) {
        setDataCompanies(companiesResponse.data.data);
      }

      if (jobsResponse?.data?.data) {
        setDataJobs(jobsResponse.data.data);
      }

      if (resumeResponse?.data) {
        setDataResumes(resumeResponse.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthlyData = [
    { month: 'T1', value: 65 },
    { month: 'T2', value: 85 },
    { month: 'T3', value: 95 },
    { month: 'T4', value: 75 },
    { month: 'T5', value: 100 },
    { month: 'T6', value: 120 },
  ];

  const recentActivity = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Đơn Ứng Tuyển Mới',
      value: `${dataResumes?.meta?.total || 0} hôm nay`,
      change: '+20%',
      isIncrease: true,
      description: 'so với hôm qua',
      color: 'bg-blue-500'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Phỏng Vấn Đang Diễn Ra',
      value: '23 đã lên lịch',
      change: '+5',
      isIncrease: true,
      description: 'chờ xác nhận',
      color: 'bg-purple-500'
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Tin Tuyển Dụng',
      value: `${dataJobs?.meta?.total || 0} tin mới`,
      change: '3',
      isIncrease: true,
      description: 'vị trí cấp bách',
      color: 'bg-green-500'
    },
  ];

  const maxValue = Math.max(...monthlyData.map(item => item.value));

  const stats = [
    {
      icon: <FileText />,
      title: 'Tổng Số Ứng Tuyển',
      value: dataResumes?.meta?.total || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <Briefcase />,
      title: 'Tổng số Công Việc',
      value: dataJobs?.meta?.total || 0,
      color: 'bg-green-500'
    },
    {
      icon: <Users />,
      title: 'Tổng Số Công Ty',
      value: dataCompanies?.meta?.total || 0,
      color: 'bg-purple-500'
    }
  ];

  return (
    <Layout className="min-h-screen flex flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-lg text-white`}>
                        {stat.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-semibold">{stat.value.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`${activity.color} p-2 rounded-lg text-white`}>
                        {activity.icon}
                      </div>
                      <h3 className="ml-3 font-medium">{activity.title}</h3>
                    </div>
                    <p className="text-2xl font-semibold mb-2">{activity.value}</p>
                    <div className="flex items-center text-sm">
                      {activity.isIncrease ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={activity.isIncrease ? "text-green-500" : "text-red-500"}>
                        {activity.change}
                      </span>
                      <span className="text-gray-500 ml-1">{activity.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-6">Thống Kê Theo Tháng</h3>
                  <div className="h-80 flex items-end space-x-4">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${(item.value / maxValue) * 100}%` }}
                        />
                        <div className="mt-2 text-sm text-gray-600">{item.month}</div>
                        <div className="text-xs text-gray-500">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;