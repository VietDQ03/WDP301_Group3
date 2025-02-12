import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import CustomButton from '../../components/CustomButton';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message, Pagination } from "antd";
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, EnvironmentOutlined, DollarOutlined, TeamOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const JobPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const debouncedSearch = useCallback(
    debounce((params) => {
      fetchJobs(params);
    }, 500),
    []
  );

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const response = await jobApi.getAll({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        name: params.name,
        level: params.level,
        location: params.location,
        sort: params.sort, // Thêm tham số sort
      });

      const { result, meta } = response.data.data;

      const currentPage = meta.current || params.current || 1;
      const pageSize = meta.pageSize || params.pageSize || 10;

      const formattedJobs = result.map((job, index) => ({
        key: job._id,
        stt: ((currentPage - 1) * pageSize) + index + 1,
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
        total: meta.total || 0,
        current: currentPage,
        pageSize: pageSize,
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
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
      },
      onOk: async () => {
        try {
          await jobApi.delete(id);
          message.success('Xóa công việc thành công');
          fetchJobs(pagination);
        } catch (error) {
          message.error('Không thể xóa công việc');
        }
      },
    });
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
      title: "Tên Công Việc",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'left' }
      })
    },
    {
      title: "Công Ty",
      dataIndex: "company",
      key: "company",
      render: (text) => (
        <div className="font-medium text-gray-700">{text}</div>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'left' }
      })
    },
    {
      title: "Địa Điểm",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <EnvironmentOutlined className="mr-2" />
          {text}
        </div>
      )
    },
    {
      title: "Mức Lương",
      dataIndex: "salary",
      key: "salary",
      render: (text) => (
        <div className="flex items-center justify-center text-gray-600">
          <DollarOutlined className="mr-2" />
          {text}
        </div>
      ),
      align: "center"
    },
    {
      title: "Cấp Bậc",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level) => (
        <Tag color="blue" className="px-3 py-1">
          {level}
        </Tag>
      )
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (text) => (
        <div className="flex items-center justify-center text-gray-600">
          <TeamOutlined className="mr-2" />
          {text}
        </div>
      )
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"} className="px-3 py-1">
          {status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      )
    },
    {
      title: "Hành Động",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
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
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    const params = {
      ...searchParams,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    };

    // Xử lý sort
    if (sorter.field && sorter.order) {
      params.sort = `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    fetchJobs(params);
  };

  const onFinish = (values) => {
    fetchJobs({
      ...values,
      current: 1
    });
  };

  const onReset = () => {
    form.resetFields();
    setSearchParams({});
    fetchJobs({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleRefresh = () => {
    fetchJobs({
      current: pagination.current,
      pageSize: pagination.pageSize
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
                Quản lý Việc Làm
              </motion.h1>
              <motion.p
                className="text-gray-500 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Quản lý và theo dõi thông tin các việc làm
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
                layout="vertical"
                className="space-y-4"
                onValuesChange={(_, allValues) => {
                  setSearchParams(allValues);
                  debouncedSearch({
                    ...allValues,
                    current: 1
                  });
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Form.Item
                    name="name"
                    label={
                      <span className="text-gray-700 font-medium">Tên Công Việc</span>
                    }
                  >
                    <Input
                      prefix={<SearchOutlined className="text-gray-400" />}
                      placeholder="Nhập tên công việc cần tìm"
                      className="h-11 rounded-lg"
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    name="level"
                    label={
                      <span className="text-gray-700 font-medium">Cấp Bậc</span>
                    }
                  >
                    <Select
                      placeholder="Chọn cấp bậc"
                      className="h-11 rounded-lg"
                      allowClear
                    >
                      <Option value="Fresher">Fresher</Option>
                      <Option value="Junior">Junior</Option>
                      <Option value="Middle">Middle</Option>
                      <Option value="Senior">Senior</Option>
                      <Option value="Leader">Leader</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="location"
                    label={
                      <span className="text-gray-700 font-medium">Địa Điểm</span>
                    }
                  >
                    <Select
                      placeholder="Chọn địa điểm"
                      className="h-11 rounded-lg"
                      allowClear
                    >
                      <Option value="HANOI">Hà Nội</Option>
                      <Option value="HOCHIMINH">Hồ Chí Minh</Option>
                      <Option value="DANANG">Đà Nẵng</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>

                  <div className="flex items-center h-full">
                    <Form.Item className="mb-0 w-full">
                      <Space size="middle" className="flex  w-full">
                        {/* <CustomButton
                          htmlType="submit"
                          icon={<SearchOutlined />}
                        >
                          Tìm kiếm
                        </CustomButton> */}
                        <Button
                          onClick={onReset}
                          size="large"
                          className="px-6 py-2 mt-1 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300"
                          style={{ height: '45px' }}
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
                  <Title level={4} className="!text-xl !mb-1">Danh sách Việc làm</Title>
                  <p className="text-gray-500 text-sm">
                    Hiển thị {jobs.length} trên tổng số {pagination.total} việc làm
                  </p>
                </div>
                <Space size="middle">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <CustomButton
                      htmlType="submit"
                      icon={<PlusOutlined />}
                    >
                      Thêm việc làm mới
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
                  {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Tooltip title="Cài đặt hiển thị">
                      <Button
                        icon={<SettingOutlined />}
                        size="large"
                        className="h-11 hover:bg-gray-50 hover:border-gray-300"
                      />
                    </Tooltip>
                  </motion.div> */}
                </Space>
              </div>

              <div className="pb-16 overflow-x-auto">
                <Table
                  dataSource={jobs}
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
                    handleTableChange({ current: page, pageSize }, {}, {});
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

export default JobPage;