import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FileText,
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
  const [collapsed, setCollapsed] = useState(false);
  const [dataCompanies, setDataCompanies] = useState([]);
  const [dataJobs, setDataJobs] = useState([]);
  const [dataResumes, setDataResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesResponse, jobsResponse, resumeResponse] = await Promise.all([
        companyApi.getAll({}),
        jobApi.getAll({}),
        resumeApi.getAll({})
      ]);

      setDataCompanies(companiesResponse?.data?.data || []);
      setDataJobs(jobsResponse?.data?.data || []);
      setDataResumes(resumeResponse?.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    }
  ];

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
    <div
      className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'
        } flex-shrink-0`}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>

    <div className="flex-1">
      {/* Nội dung chính */}
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="m-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="max-w-screen-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4">Trang Tổng Quan</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-12 hover:shadow-xl transition-shadow mt-8"
                    >
                      <div className="flex items-center">
                        <div className={`${stat.color} p-4 rounded-xl text-white`}>
                          {stat.icon}
                        </div>
                        <div className="ml-6">
                          <p className="text-xl font-semibold">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-8 pl-12 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center mb-6">
                        <div className={`${activity.color} p-4 rounded-xl text-white`}>
                          {activity.icon}
                        </div>
                        <h3 className="ml-6 text-xl font-semibold">{activity.title}</h3>
                      </div>
                      <p className="text-2xl font-bold mb-4">{activity.value}</p>
                      <div className="flex items-center text-lg">
                        {activity.isIncrease ? (
                          <ArrowUp className="w-6 h-6 text-green-500 mr-2" />
                        ) : (
                          <ArrowDown className="w-6 h-6 text-red-500 mr-2" />
                        )}
                        <span className={activity.isIncrease ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                          {activity.change}
                        </span>
                        <span className="text-gray-500 ml-2">{activity.description}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Content >
        </Layout>
      </div>
    </Layout >
  );
};

export default DashboardPage;