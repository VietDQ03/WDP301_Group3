import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Statistic, message } from 'antd';
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
    try {
      const [companiesResponse, jobsResponse, usersResponse, resumeResponse] = await Promise.all([
        companyApi.getAll({ ...params }),
        jobApi.getAll({ ...params }),
        userApi.getAll({ ...params }),
        resumeApi.getAll({ ...params })
      ]);

      if (companiesResponse?.data?.data) {
        setDataCompanies(companiesResponse.data.data);
      }

      if (jobsResponse?.data?.data) {
        setDataJobs(jobsResponse.data.data);
      }

      if (usersResponse?.data) {
        setDataUsers(usersResponse.data);
      }

      if (resumeResponse?.data) {
        setDataResumes(resumeResponse.data);
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recentActivity = [
    {
      title: 'Đơn Ứng Tuyển Mới',
      value: '45 hôm nay',
      description: 'Tăng 20% so với hôm qua',
    },
    {
      title: 'Phỏng Vấn Đang Diễn Ra',
      value: '23 đã lên lịch',
      description: '5 chờ xác nhận',
    },
    {
      title: 'Tin Tuyển Dụng',
      value: '12 tin mới',
      description: '3 vị trí cấp bách',
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Trang Tổng Quan</h1>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="bg-blue-50 hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between items-start">
                    <Statistic
                      title={<span className="text-gray-600">Tổng Số Người Dùng</span>}
                      value={dataUsers?.meta?.total || 0}
                      formatter={() => (
                        <CountUp
                          start={0}
                          end={dataUsers?.meta?.total || 0}
                          duration={0.5}
                          separator=","
                        />
                      )}
                    />
                    <div className="p-2 rounded-lg bg-white/60">
                      <UserOutlined className="text-blue-500 text-2xl" />
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="bg-purple-50 hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between items-start">
                    <Statistic
                      title={<span className="text-gray-600">Tổng Số Ứng Tuyển</span>}
                      value={dataResumes?.meta?.total || 0}
                      formatter={() => (
                        <CountUp
                          start={0}
                          end={dataResumes?.meta?.total || 0}
                          duration={0.5}
                          separator=","
                        />
                      )}
                    />
                    <div className="p-2 rounded-lg bg-white/60">
                      <FileOutlined className="text-purple-500 text-2xl" />
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="bg-green-50 hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between items-start">
                    <Statistic
                      title={<span className="text-gray-600">Tổng số Công Việc</span>}
                      value={dataJobs?.meta?.total || 0}
                      formatter={() => (
                        <CountUp
                          start={0}
                          end={dataJobs?.meta?.total || 0}
                          duration={0.5}
                          separator=","
                        />
                      )}
                    />
                    <div className="p-2 rounded-lg bg-white/60">
                      <ShoppingOutlined className="text-green-500 text-2xl" />
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="bg-orange-50 hover:shadow-md transition-shadow"
                  bordered={false}
                >
                  <div className="flex justify-between items-start">
                    <Statistic
                      title={<span className="text-gray-600">Tổng Số Công Ty</span>}
                      value={dataCompanies?.meta?.total || 0}
                      formatter={() => (
                        <CountUp
                          start={0}
                          end={dataCompanies?.meta?.total || 0}
                          duration={0.5}
                          separator=","
                        />
                      )}
                    />
                    <div className="p-2 rounded-lg bg-white/60">
                      <TeamOutlined className="text-orange-500 text-2xl" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hoạt Động Gần Đây</h2>
            <Row gutter={[16, 16]}>
              {recentActivity.map((activity, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card className="hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium mb-2">{activity.title}</h3>
                    <p className="text-2xl font-semibold text-gray-800 mb-1">
                      {activity.value}
                    </p>
                    <p className="text-gray-500">{activity.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Additional Content */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title="Thống Kê Theo Tháng"
                className="hover:shadow-md transition-shadow"
              >
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component will be placed here
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title="Thao Tác Nhanh"
                className="hover:shadow-md transition-shadow"
              >
                <ul className="space-y-4">
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <FileOutlined className="mr-2" /> Đăng Tin Tuyển Dụng
                  </li>
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <UserOutlined className="mr-2" /> Xem Đơn Ứng Tuyển
                  </li>
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <TeamOutlined className="mr-2" /> Lên Lịch Phỏng Vấn
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;