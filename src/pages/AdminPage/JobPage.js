import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message, } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { debounce, max } from 'lodash';

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
  const [searchParams, setSearchParams] = useState({});


  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await jobApi.getAll({
        page: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params,
      });

      const { result, meta } = response.data;

      const formattedJobs = result.map((job, index) => ({
        key: job._id,
        stt: index + 1 + ((meta.current ? meta.current - 1 : 0) * meta.pageSize),
        name: job.name,
        company: job.company.name,
        location: job.location,
        salary: new Intl.NumberFormat("vi-VN").format(job.salary) + " đ",
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

  const handleSearchChange = debounce((value, field) => {
    form.setFieldsValue({ [field]: value });
    fetchJobs({
      ...form.getFieldsValue(),
      current: 1,
    });
  }, 500);

  const handleDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa công việc này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await jobApi.delete(id);
          message.success("Xóa công việc thành công!");
          fetchJobs({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        } catch (error) {
          console.error("Error deleting job:", error);
          message.error("Có lỗi xảy ra khi xóa công việc!");
        }
      },
    });
  };

  const statusMap = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
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
        style: { textAlign: "center" },
      }),
    },
    {
      title: "Công Ty",
      dataIndex: "company",
      key: "company",
      onHeaderCell: () => ({
        style: { textAlign: "center" },
      }),
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
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{statusMap[status]}</Tag>
      ),
    },
    {
      title: "Hành Động",
      align: "center",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
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
    fetchJobs({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleRefresh = () => {
    fetchJobs({
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          {/* Search Section */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              layout="vertical"
              className="space-y-4"
              onValuesChange={(changedValues, allValues) => {
                const searchParams = {
                  ...allValues,
                  current: 1,
                  name: allValues.name?.trim() || undefined,
                  location: allValues.location || undefined,
                  level: allValues.level || undefined,
                  isActive: allValues.status !== undefined ? allValues.status : undefined // ✅ Gán đúng key API yêu cầu
                };

                setSearchParams(searchParams);
                handleSearchChange(searchParams);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Tên Công Việc</label>
                  <Form.Item name="name" className="mb-0">
                    <Input
                      prefix={<SearchOutlined className="text-gray-400" />}
                      placeholder="Nhập tên công việc cần tìm"
                      className="h-11 rounded-lg"
                    />
                  </Form.Item>
                </div>

                <Form.Item name="level" label="Mức Độ" className="col-span-1">
                  <Input
                    placeholder="Nhập mức độ (FRESHER, JUNIOR, ...)"
                    style={{ height: "40px" }}
                    onChange={(e) => handleSearchChange(e.target.value, "level")}
                  />
                </Form.Item>
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Địa Điểm</label>
                  <Form.Item name="location" className="mb-0">
                    <Select
                      placeholder="Chọn địa điểm"
                      className="h-11 w-full"
                      allowClear
                    >
                      <Option value="HANOI">Hà Nội</Option>
                      <Option value="HOCHIMINH">Hồ Chí Minh</Option>
                      <Option value="DANANG">Đà Nẵng</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div>
                  <Form.Item name="isActive" label="Trạng Thái" className="mb-0">
                    <Select placeholder="Chọn trạng thái" className="h-11 w-full" allowClear>
                      <Option value={true}>Đang hoạt</Option>
                      <Option value={false}>Ngưng tuyển</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={onReset}
                    size="large"
                    className="h-11 px-6 flex items-center"
                    icon={<ReloadOutlined />}
                  >
                    Đặt lại
                  </Button>
                </div>
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