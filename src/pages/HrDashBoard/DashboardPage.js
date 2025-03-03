import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Sidebar from '../../components/HrDashBoard/Sidebar';
import Header from '../../components/HrDashBoard/Header';
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import { useSelector } from 'react-redux';

const { Content } = Layout;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dataJobs, setDataJobs] = useState([]);
  const [dataResumes, setDataResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);


  const fetchData = async () => {
    if (!user?.company?._id) return;

    setLoading(true);
    try {
      const defaultParams = {
        current: 1,
        pageSize: 1000
      };

      const [jobsResponse, resumeResponse] = await Promise.all([
        jobApi.findByCompany(user.company._id, defaultParams),
        resumeApi.findByCompany(user.company._id, defaultParams)
      ]);

      setDataJobs(jobsResponse?.data || []);
      setDataResumes(resumeResponse?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.company?._id) {
      fetchData();
    }
  }, [user]);

  const getRecentApplications = () => {
    if (!dataResumes?.data?.result) return 0;

    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000); // 24h trước

    const recentApplications = dataResumes.data.result.filter(resume => {
      const createdDate = new Date(resume.createdAt);
      return createdDate >= last24Hours;
    });

    return recentApplications.length;
  };

  const getRecentJobs = () => {
    if (!dataJobs?.data?.result) return 0;
    
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);

    const recentJobs = dataJobs.data.result.filter(job => {
      const createdDate = new Date(job.createdAt);
      return createdDate >= last24Hours;
    });

    return recentJobs.length;
  };

  // Tính phần trăm thay đổi
  const calculateChange = (data, field = 'createdAt') => {
    if (!data) return { change: 0, isIncrease: true };
    
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
    const previous24Hours = new Date(now - 48 * 60 * 60 * 1000);

    const recentItems = data.filter(item => {
      const date = new Date(item[field]);
      return date >= last24Hours;
    }).length;

    const previousItems = data.filter(item => {
      const date = new Date(item[field]);
      return date >= previous24Hours && date < last24Hours;
    }).length;

    const difference = recentItems - previousItems;
    return {
      change: difference,
      isIncrease: difference >= 0
    };
  };

  const getApplicationChange = () => {
    return calculateChange(dataResumes?.data?.result);
  };

  const getJobsChange = () => {
    return calculateChange(dataJobs?.data?.result);
  };

  const recentActivity = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Đơn Ứng Tuyển Mới',
      value: `${getRecentApplications()} đơn mới`,
      ...getApplicationChange(),
      description: 'so với hôm qua',
      color: 'bg-blue-500'
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Tin Tuyển Dụng',
      value: `${getRecentJobs()} tin mới`,
      ...getJobsChange(),
      description: 'so với hôm qua',
      color: 'bg-green-500'
    }
  ];

  const stats = [
    {
      icon: <FileText />,
      title: 'Tổng Số Ứng Tuyển',
      value: dataResumes?.data?.meta?.total || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <Briefcase />,
      title: 'Tổng số Công Việc',
      value: dataJobs?.data?.meta?.total || 0,
      color: 'bg-green-500'
    },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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