import React, { useEffect, useState } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Modal, message, Pagination } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  MailOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { motion } from 'framer-motion';
import CustomButton from '../../components/CustomButton';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const ResumePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [companies, setCompanies] = useState({});
  const [jobs, setJobs] = useState({});
  const [users, setUsers] = useState({});
  const [searchValues, setSearchValues] = useState({
    candidate: '',
    company: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchDetails = async (id, type) => {
    try {
      let response;
      switch (type) {
        case 'user':
          response = await userApi.getOne(id);
          if (response?.data) {
            setUsers(prev => ({
              ...prev,
              [id]: response.data.email || 'N/A'
            }));
          }
          break;

        case 'job':
          response = await jobApi.getOne(id);
          if (response?.data) {
            setJobs(prev => ({
              ...prev,
              [id]: response.data.name || 'N/A'
            }));
          }
          break;

        case 'company':
          response = await companyApi.findOne(id);
          if (response?.data) {
            setCompanies(prev => ({
              ...prev,
              [id]: response.data.name || 'N/A'
            }));
          }
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      switch (type) {
        case 'user':
          setUsers(prev => ({ ...prev, [id]: 'N/A' }));
          break;
        case 'job':
          setJobs(prev => ({ ...prev, [id]: 'N/A' }));
          break;
        case 'company':
          setCompanies(prev => ({ ...prev, [id]: 'N/A' }));
          break;
      }
    }
  };

  const fetchResumes = async (params = {}) => {
    try {
      setLoading(true);
      const response = await resumeApi.search({
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...params
      });

      if (response?.data) {
        const formattedResumes = response.data.result.map((resume, index) => ({
          key: resume._id,
          stt: index + 1 + ((response.data.meta.current - 1) * response.data.meta.pageSize),
          id: resume._id,
          email: resume.email,
          url: resume.url,
          status: resume.status,
          companyId: resume.companyId,
          jobId: resume.jobId,
          createdBy: resume.createdBy,
          userId: resume.userId,
          createdAt: new Date(resume.createdAt).toLocaleString(),
          updatedAt: new Date(resume.updatedAt).toLocaleString(),
        }));

        const uniqueIds = {
          company: [...new Set(formattedResumes.map(resume => resume.companyId))],
          job: [...new Set(formattedResumes.map(resume => resume.jobId))],
          user: [...new Set(formattedResumes.map(resume => resume.userId))]
        };

        Object.entries(uniqueIds).forEach(([type, ids]) => {
          ids.forEach(id => {
            const stateMap = type === 'company' ? companies :
              type === 'job' ? jobs : users;
            if (id && !stateMap[id]) {
              fetchDetails(id, type);
            }
          });
        });

        setResumes(formattedResumes);
        setPagination({
          current: response.data.meta.current,
          pageSize: response.data.meta.pageSize,
          total: response.data.meta.total,
        });
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      message.error('Không thể tải danh sách hồ sơ ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'Bạn có chắc chắn muốn xóa hồ sơ này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
      },
      onOk: async () => {
        try {
          await resumeApi.delete(id);
          message.success('Xóa hồ sơ thành công');
          fetchResumes(pagination);
        } catch (error) {
          message.error('Không thể xóa hồ sơ');
          console.error('Error:', error);
        }
      },
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await resumeApi.updateStatus(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
      fetchResumes(pagination);
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
      console.error('Error:', error);
    }
  };

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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <MailOutlined className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: "Tên Ứng Viên",
      align: "center",
      key: "username",
      render: (_, record) => (
        <div className="font-medium text-gray-800">
          {users[record.userId] ? users[record.userId].split('@')[0] : ''}
        </div>
      ),
    },
    {
      title: "Hồ sơ",
      key: "resume",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem hồ sơ">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => window.open(record.url, '_blank')}
            >
              Xem hồ sơ
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Công ty",
      align: "center",
      dataIndex: "companyId",
      render: (companyId) => (
        <div className="flex items-center justify-center text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {companies[companyId] || ''}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          className="w-32"
          onChange={(newStatus) => handleUpdateStatus(record.id, newStatus)}
        >
          <Option value="PENDING">
            <span className="text-orange-500">PENDING</span>
          </Option>
          <Option value="APPROVED">
            <span className="text-green-500">APPROVED</span>
          </Option>
          <Option value="REJECTED">
            <span className="text-red-500">REJECTED</span>
          </Option>
        </Select>
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => console.log('Edit resume:', record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchResumes({
      ...newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
      ...searchValues
    });
  };

  const onFinish = (values) => {
    setSearchValues(values);
    fetchResumes({
      ...values,
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const onReset = () => {
    form.resetFields();
    setSearchValues({
      candidate: '',
      company: '',
      status: ''
    });
    fetchResumes({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleRefresh = () => {
    fetchResumes({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    });
  };

  return (
    <Layout className="min-h-screen flex flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

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
                Quản lý Hồ sơ Ứng tuyển
              </motion.h1>
              <motion.p
                className="text-gray-500 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Quản lý và theo dõi hồ sơ ứng tuyển của ứng viên
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
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Form.Item
                    name="candidate"
                    label={
                      <span className="text-gray-700 font-medium">Tên Ứng Viên</span>
                    }
                  >
                    <Input
                      prefix={<SearchOutlined className="text-gray-400" />}
                      placeholder="Nhập tên ứng viên"
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="company"
                    label={
                      <span className="text-gray-700 font-medium">Công ty</span>
                    }
                  >
                    <Input
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                      placeholder="Nhập tên công ty"
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>

                  <div className="flex items-center h-full">
                    <Form.Item className="mb-0 w-full">
                      <Space size="middle" className="flex w-full">
                        <CustomButton
                          htmlType="submit"
                          icon={<SearchOutlined />}
                        >
                          Tìm kiếm
                        </CustomButton>
                        <Button
                          onClick={onReset}
                          size="large"
                          className="h-11 px-6 flex items-center"
                          icon={<ReloadOutlined />}
                        >
                          Đặt lại
                        </Button>
                      </Space>
                    </Form.Item>
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
                  <Title level={4} className="!text-xl !mb-1">Danh sách Hồ sơ Ứng tuyển</Title>
                  <p className="text-gray-500 text-sm">
                    Hiển thị {resumes.length} trên tổng số {pagination.total} hồ sơ
                  </p>
                </div>
                <Space size="middle">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <CustomButton
                      htmlType="submit"
                      icon={<PlusOutlined />}
                    >
                      Thêm hồ sơ mới
                    </CustomButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Tooltip title="Làm mới dữ liệu">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        size="large"
                        className="h-11 hover:bg-gray-50 hover:border-gray-300"
                      />
                    </Tooltip>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Tooltip title="Cài đặt hiển thị">
                      <Button
                        icon={<SettingOutlined />}
                        size="large"
                        className="h-11 hover:bg-gray-50 hover:border-gray-300"
                      />
                    </Tooltip>
                  </motion.div>
                </Space>
              </div>

              <div className="pb-16 overflow-x-auto">
                <Table
                  dataSource={resumes}
                  columns={columns}
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className="shadow-sm rounded-lg overflow-hidden"
                  loading={loading}
                  rowClassName={() => 'hover:bg-gray-50 transition-colors'}
                  onRow={(record) => ({
                    className: 'cursor-pointer'
                  })}
                />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Pagination
                  {...pagination}
                  showSizeChanger
                  onChange={(page, pageSize) => {
                    fetchResumes({
                      current: page,
                      pageSize: pageSize
                    });
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ResumePage;