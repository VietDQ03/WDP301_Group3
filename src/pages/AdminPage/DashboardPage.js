import React from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import Sidebar from '../../components/AdminPage/Sidebar';
import Header from '../../components/AdminPage/Header';

const { Content } = Layout;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const statisticsData = [
    {
      title: 'Active Users',
      value: 112845,
      icon: <UserOutlined className="text-blue-500 text-2xl" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Total Jobs',
      value: 5684,
      icon: <ShoppingOutlined className="text-green-500 text-2xl" />,
      color: 'bg-green-50',
    },
    {
      title: 'Resumes',
      value: 12456,
      icon: <FileOutlined className="text-purple-500 text-2xl" />,
      color: 'bg-purple-50',
    },
    {
      title: 'Companies',
      value: 2345,
      icon: <TeamOutlined className="text-orange-500 text-2xl" />,
      color: 'bg-orange-50',
    },
  ];

  const recentActivity = [
    {
      title: 'New Applications',
      value: '45 today',
      description: '20% increase from yesterday',
    },
    {
      title: 'Active Interviews',
      value: '23 scheduled',
      description: '5 pending confirmation',
    },
    {
      title: 'Job Posts',
      value: '12 new',
      description: '3 urgent positions',
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Content className="m-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
            
            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
              {statisticsData.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card 
                    className={`${stat.color} hover:shadow-md transition-shadow`}
                    bordered={false}
                  >
                    <div className="flex justify-between items-start">
                      <Statistic
                        title={<span className="text-gray-600">{stat.title}</span>}
                        value={stat.value}
                        formatter={value => value.toLocaleString()}
                      />
                      <div className="p-2 rounded-lg bg-white/60">
                        {stat.icon}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
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
                title="Monthly Statistics" 
                className="hover:shadow-md transition-shadow"
              >
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component will be placed here
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="Quick Actions" 
                className="hover:shadow-md transition-shadow"
              >
                <ul className="space-y-4">
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <FileOutlined className="mr-2" /> Post New Job
                  </li>
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <UserOutlined className="mr-2" /> Review Applications
                  </li>
                  <li className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800">
                    <TeamOutlined className="mr-2" /> Schedule Interviews
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