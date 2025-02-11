import React, { useEffect, useState } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

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
      // Set default value based on type
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
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        job: params.job,
        company: params.company,
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
  
        // Fetch all unique IDs
        const uniqueIds = {
          company: [...new Set(formattedResumes.map(resume => resume.companyId))],
          job: [...new Set(formattedResumes.map(resume => resume.jobId))],
          user: [...new Set(formattedResumes.map(resume => resume.userId))]
        };
  
        // Fetch details for each type
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
      message.error('Không thể tải danh sách resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes({
      current: 1,
      pageSize: 10,
    });
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa resume này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await resumeApi.delete(id);
          message.success('Xóa resume thành công!');
          fetchResumes(pagination);
        } catch (error) {
          console.error("Error deleting resume:", error);
          message.error('Có lỗi xảy ra khi xóa resume!');
        }
      },
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await resumeApi.updateStatus(id, newStatus);
      message.success('Cập nhật trạng thái thành công!');
      fetchResumes(pagination);
    } catch (error) {
      console.error("Error updating status:", error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      }),
      render: (text) => <span className="text-blue-500">{text}</span>,
    },
    {
      title: "Tên Ứng Viên",
      align: "center",
      key: "username",
      render: (_, record) => (
        <span>{users[record.userId] ? users[record.userId].split('@')[0] : ' '}</span>
      ),
    },
    {
      title: "Hồ Sơ",
      align: "center",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
          {text}
        </a>
      ),
    },
    {
      title: "Công ty",
      align: "center",
      dataIndex: "companyId",
      key: "company",
      render: (companyId) => (
        <span>{companies[companyId] || ' '}</span>
      ),
    },
    {
      title: "Công việc",
      align: "center",
      dataIndex: "jobId",
      key: "job",
      render: (jobId) => (
        <span>{jobs[jobId] || ' '}</span>
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
          style={{ width: 120 }}
          onChange={(newStatus) => handleUpdateStatus(record.id, newStatus)}
        >
          <Option value="PENDING">
            <span style={{ color: '#f97316' }}>PENDING</span>
          </Option>
          <Option value="APPROVED">
            <span style={{ color: '#22c55e' }}>APPROVED</span>
          </Option>
          <Option value="REJECTED">
            <span style={{ color: '#ef4444' }}>REJECTED</span>
          </Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => {
                console.log("Edit resume:", record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
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
      ...filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const onFinish = (values) => {
    fetchResumes({
      ...pagination,
      current: 1,
      ...values,
    });
  };

  const onReset = () => {
    form.resetFields();
    fetchResumes({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleRefresh = () => {
    fetchResumes(pagination);
  };

  return (
    <Layout className="min-h-screen flex flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          {/* Search Section */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="ml-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="job" label="Tên Ứng viên" className="col-span-1">
                  <Input placeholder="Nhập tên ứng viên" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item name="company" label="Công ty" className="col-span-1">
                  <Input placeholder="Nhập tên công ty" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item className="col-span-1" style={{ marginBottom: 0, marginTop: '35px' }}>
                  <div className="flex space-x-2">
                    <Button type="primary" htmlType="submit">
                      Tìm kiếm
                    </Button>
                    <Button onClick={onReset}>Đặt lại</Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>

          {/* List Section */}
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                DANH SÁCH ỨNG TUYỂN
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm mới
                </Button>
                <Tooltip title="Làm mới">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
                <Tooltip title="Cài đặt">
                  <Button icon={<SettingOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <Table
              dataSource={resumes}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
              bordered
              size="middle"
              className="overflow-x-auto"
              loading={loading}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ResumePage;