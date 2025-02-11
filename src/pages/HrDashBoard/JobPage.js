import React, { useEffect, useState } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message, } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const JobPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await jobApi.getAll({
        page: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params
      });

      const { result, meta } = response.data.data;

      const formattedJobs = result.map((job, index) => ({
        key: job._id,
        stt: index + 1 + ((meta.current - 1) * meta.pageSize),
        name: job.name,
        company: job.company.name,
        location: job.location,
        salary: new Intl.NumberFormat('vi-VN').format(job.salary) + ' đ',
        level: job.level,
        quantity: job.quantity,
        status: job.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: new Date(job.createdAt).toLocaleString(),
        updatedAt: new Date(job.updatedAt).toLocaleString(),
      }));

      setJobs(formattedJobs);
      setPagination({
        ...pagination,
        total: meta.total,
        current: meta.current || 1,
        pageSize: meta.pageSize || 10,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Có lỗi xảy ra khi tải danh sách công việc!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa công việc này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await jobApi.delete(id);
          message.success('Xóa công việc thành công!');
          fetchJobs({
            current: pagination.current,
            pageSize: pagination.pageSize
          });
        } catch (error) {
          console.error("Error deleting job:", error);
          message.error('Có lỗi xảy ra khi xóa công việc!');
        }
      },
    });
  };

  const statusMap = {
    "ACTIVE": "Hoạt động",
    "INACTIVE": "Không hoạt động"
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      className: "text-center",
      align: "center",
    },
    {
      title: "Tên Job",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Công Ty",
      dataIndex: "company",
      key: "company",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Địa Điểm",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Mức Lương",
      dataIndex: "salary",
      key: "salary",
      align: "center",
    },
    {
      title: "Mức Độ",
      align: "center",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      align: "center",
      key: "quantity",
    },
    {
      title: "Trạng Thái",
      align: "center",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {statusMap[status]}
        </Tag>
      ),
    },
    {
      title: "Hành Động",
      align: "center",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(record.key)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchJobs({
      ...newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const onFinish = (values) => {
    fetchJobs({
      ...values,
      current: 1
    });
  };

  const onReset = () => {
    form.resetFields();
    fetchJobs();
  };

  const handleRefresh = () => {
    fetchJobs({
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  const handleEdit = (id) => {
    console.log("Edit job with id:", id);
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
              className="ml-4"
              layout="vertical"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="name" label="Tên Việc Làm" className="col-span-1">
                  <Input placeholder="Nhập tên việc làm" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item name="level" label="Mức Độ" className="col-span-1">
                  <Select placeholder="Chọn mức độ" style={{ height: '40px' }}>
                    <Option value="FRESHER">FRESHER</Option>
                    <Option value="JUNIOR">JUNIOR</Option>
                    <Option value="MIDDLE">MIDDLE</Option>
                    <Option value="SENIOR">SENIOR</Option>
                  </Select>
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
                DANH SÁCH VIỆC LÀM
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
              loading={loading}
              dataSource={jobs}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
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

export default JobPage;