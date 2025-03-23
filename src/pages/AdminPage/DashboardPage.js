import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Statistic, message, Spin } from 'antd';
import { UserOutlined, ShoppingOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import Sidebar from '../../components/AdminPage/Sidebar';
import Header from '../../components/AdminPage/Header';
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import CountUp from 'react-countup';

const { Content } = Layout;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [dataCompanies, setDataCompanies] = useState([]);
  const [dataJobs, setDataJobs] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataResumes, setDataResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (params = {}) => {
    setLoading(true);
    const defaultParams = {
      current: 1,
      pageSize: 1000,
      ...params
    };

    try {
      const [companiesResponse, jobsResponse, usersResponse, resumeResponse] = await Promise.all([
        companyApi.getAll(defaultParams),
        jobApi.getAll(defaultParams),
        userApi.getAll(defaultParams), 
        resumeApi.getAll(defaultParams)
      ]);

      setDataCompanies(companiesResponse?.data || {});
      setDataJobs(jobsResponse?.data || {});
      setDataUsers(usersResponse?.data || {});
      setDataResumes(resumeResponse?.data || {});
    } catch (error) {
      message.error('Không thể tải dữ liệu');
      console.error('Error:', error);
    }
    setLoading(false);
};

useEffect(() => {
    fetchData();
}, []);

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      title: "Người Dùng",
      value: dataUsers?.meta?.total || 0,
      icon: <UserOutlined className="text-2xl" />,
      color: "blue",
      description: "Tổng số người dùng đăng ký",
      details: [
        { 
          label: "Mới trong tháng", 
          value: `${dataUsers?.result?.filter(user => {
            const userDate = new Date(user.createdAt);
            const today = new Date();
            return userDate.getMonth() === today.getMonth() && 
                   userDate.getFullYear() === today.getFullYear();
          }).length || 0} người dùng`
        }
      ]
    },
    {
      title: "Hồ Sơ",
      value: dataResumes?.meta?.total || 0,
      icon: <FileOutlined className="text-2xl" />,
      color: "purple",
      description: "Tổng số hồ sơ ứng tuyển",
      details: [
        { 
          label: "Đã duyệt", 
          value: `${dataResumes?.result?.filter(resume => resume.status === 'APPROVED').length || 0} hồ sơ`
        },
        { 
          label: "Chờ duyệt", 
          value: `${dataResumes?.result?.filter(resume => resume.status === 'PENDING').length || 0} hồ sơ`
        },
        { 
          label: "Từ chối", 
          value: `${dataResumes?.result?.filter(resume => resume.status === 'REJECTED').length || 0} hồ sơ`
        }
      ]
    },
    {
      title: "Công Việc",
      value: dataJobs?.meta?.total || 0,
      icon: <ShoppingOutlined className="text-2xl" />,
      color: "green",
      description: "Tổng số việc làm đang tuyển",
      details: [
        { 
          label: "Đang tuyển", 
          value: `${dataJobs?.result?.filter(job => job.isActive).length || 0} việc làm`
        },
        { 
          label: "Full-time", 
          value: `${dataJobs?.result?.filter(job => job.level === 'FULLTIME').length || 0} việc làm`
        },
        { 
          label: "Part-time", 
          value: `${dataJobs?.result?.filter(job => job.level === 'PARTTIME').length || 0} việc làm`
        }
      ]
    },
    {
      title: "Công Ty",
      value: dataCompanies?.meta?.total || 0,
      icon: <TeamOutlined className="text-2xl" />,
      color: "orange",
      description: "Tổng số công ty đối tác",
      details: [
        { 
          label: "Đang hoạt động", 
          value: `${dataCompanies?.result?.filter(company => company.isActive).length || 0} công ty`
        },
        { 
          label: "Mới trong tháng", 
          value: `${dataCompanies?.result?.filter(company => {
            const companyDate = new Date(company.createdAt);
            const today = new Date();
            return companyDate.getMonth() === today.getMonth() && 
                   companyDate.getFullYear() === today.getFullYear();
          }).length || 0} công ty`
        }
      ]
    }
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'} flex-shrink-0`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          <Spin spinning={loading}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Tổng Quan Hệ Thống
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Cập nhật lần cuối: {new Date().toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => fetchData()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới dữ liệu
                </button>
              </div>

              <Row gutter={[24, 24]}>
                {stats.map((stat, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Card
                      className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-${stat.color}-50 border-${stat.color}-100`}
                      bordered={false}
                    >
                      <div className="flex items-start gap-6">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600`}>
                          {stat.icon}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
                          <div className="mt-2">
                            <span className="text-3xl font-bold text-gray-900">
                              <CountUp
                                start={0}
                                end={stat.value}
                                duration={2}
                                separator=","
                              />
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                        </div>
                      </div>

                      <div className={`mt-6 h-1.5 w-full bg-${stat.color}-100 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full bg-${stat.color}-500`} 
                          style={{ 
                            width: `${(stat.value / 100) * 100}%`,
                            transition: 'width 1s ease-in-out' 
                          }}
                        />
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        {stat.details.map((detail, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-semibold text-gray-700">
                              {detail.value}
                            </div>
                            <div className="text-sm text-gray-500">
                              {detail.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;