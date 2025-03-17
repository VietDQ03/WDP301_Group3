import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import CustomButton from '../../components/Other/CustomButton';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, message, Pagination } from "antd";
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EnvironmentOutlined, DollarOutlined, TeamOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce, max } from 'lodash';
import AddEditModal from './Modal/AddEditJobModal';
import ViewJobModal from './Modal/ViewJobModal';
import DeleteConfirmModal from '../../components/Other/DeleteConfirmModal';
import { useSelector } from "react-redux";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import AlertComponent from '../../components/Other/AlertComponent';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;


const JobPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: 'error', message: '' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const { user } = useSelector((state) => state.auth);

  const debouncedSearch = useCallback(
    debounce((params) => {
      fetchJobs(params);
    }, 500),
    []
  );

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await jobApi.findByCompany(user?.company?._id, {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        name: params.name,
        location: params.location,
        level: params.level,
        skills: params.skills,
        isActive: params.isActive,
        sort: params.sort,
        search: params.search,
        company: params.company,
        salary: params.salary
      });

      const { result, meta } = response.data.data;

      const formattedJobs = result.map((job, index) => ({
        key: job._id,
        stt: ((meta.current - 1) * meta.pageSize) + index + 1,
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
        current: meta.current,
        pageSize: meta.pageSize,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Có lỗi xảy ra khi tải danh sách công việc!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (user?.company?._id) {
          const response = await companyApi.findOne(user.company._id);
          setCompanyData(response);
        }

        await fetchJobs();
      } catch (error) {
        console.error("Error initializing data:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    init();
  }, [user?.company?._id]);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await jobApi.delete(deleteTargetId);
      message.success('Xóa công việc thành công');
      await fetchJobs(pagination);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting job:", error);
      message.error('Không thể xóa công việc');
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
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
      maxWidth: 320,
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'left' }
      })
    },
    {
      title: "Địa Điểm",
      dataIndex: "location",
      key: "location",
      render: (location) => {
        // Logic chuyển đổi giá trị location sang tên tiếng Việt
        const renderLocation = (value) => {
          switch (value) {
            case "HANOI":
              return "Hà Nội";
            case "HOCHIMINH":
              return "Hồ Chí Minh";
            case "DANANG":
              return "Đà Nẵng";
            case "OTHER":
              return "Khác";
            default:
              return value || "Không xác định"; // Trường hợp không khớp giá trị nào
          }
        };

        return (
          <div className="flex items-center text-gray-600">
            <EnvironmentOutlined className="mr-2" />
            {renderLocation(location)}
          </div>
        );
      }
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
      title: "Thời gian làm việc",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level) => {
        const levelMap = {
          'FULLTIME': 'Toàn thời gian',
          'PARTTIME': 'Bán thời gian',
          'OTHER': 'Khác'
        };

        const colorMap = {
          'FULLTIME': 'blue',
          'PARTTIME': 'green',
          'OTHER': 'orange'
        };

        return (
          <Tag color={colorMap[level]} className="px-3 py-1">
            {levelMap[level] || level}
          </Tag>
        );
      }
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
          {status === "ACTIVE" ? "Đang tuyển" : "Ngưng tuyển"}
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
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => handleEdit(record)}
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

  const handleViewDetail = async (record) => {
    try {
      const response = await jobApi.getOne(record.key);
      const jobDetail = response;

      const formattedJobDetail = {
        _id: jobDetail._id,
        name: jobDetail.name,
        skills: jobDetail.skills.map(skill => skill.name),
        company: jobDetail.company,
        location: jobDetail.location,
        salary: jobDetail.salary,
        quantity: jobDetail.quantity,
        level: jobDetail.level,
        description: jobDetail.description,
        startDate: jobDetail.startDate,
        endDate: jobDetail.endDate,
        status: jobDetail.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: jobDetail.createdAt,
        updatedAt: jobDetail.updatedAt
      };

      setSelectedJob(formattedJobDetail);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching job detail:", error);
      message.error("Có lỗi xảy ra khi tải thông tin công việc!");
    }
  };

  const handleEdit = async (record) => {
    try {
      const response = await jobApi.getOne(record.key);
      const jobDetail = response;

      const formattedJobDetail = {
        _id: jobDetail._id,
        name: jobDetail.name,
        skills: jobDetail.skills,
        company: jobDetail.company,
        location: jobDetail.location,
        salary: jobDetail.salary,
        quantity: jobDetail.quantity,
        level: jobDetail.level,
        description: jobDetail.description,
        startDate: jobDetail.startDate,
        endDate: jobDetail.endDate,
        isActive: jobDetail.isActive,
        key: record.key
      };

      setModalMode('edit');
      setSelectedJob(formattedJobDetail);
      setIsAddEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching job detail:", error);
      message.error("Có lỗi xảy ra khi tải thông tin công việc!");
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedJob(null);
    setIsAddEditModalOpen(true);
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setIsAlertVisible(true);
    setTimeout(() => {
      setIsAlertVisible(false);
    }, 5000);
  };

  const handleSubmit = async (formData) => {
    try {
      const submissionData = {
        ...formData,
        company: companyData._id // Chỉ gửi ID của company
      };
  
      if (modalMode === 'add') {
        await jobApi.create(submissionData);
        setIsAddEditModalOpen(false);
        showAlert('success', 'Thêm công việc thành công');
      } else if (modalMode === 'edit') {
        await jobApi.update(selectedJob._id, submissionData);
        setIsAddEditModalOpen(false);
        showAlert('success', 'Cập nhật công việc thành công');
      }
      fetchJobs(pagination);
  
    } catch (error) {
      console.error('Error submitting job:', error);
      setIsAddEditModalOpen(false);
      showAlert('error', error?.message || 'Vui lòng thử lại');
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setSelectedJob(null);
    setModalMode('add');
  };

  return (
    <Layout className="min-h-screen flex flex-row">
      <div
        className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'
          } flex-shrink-0`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1">
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
                  onValuesChange={(changedValues, allValues) => {
                    const searchParams = {
                      ...allValues,
                      current: 1,
                      name: allValues.name?.trim() || undefined,
                      location: allValues.location || undefined,
                      level: allValues.level || undefined,
                      isActive: allValues.status
                    };

                    delete searchParams.status;

                    setSearchParams(searchParams);
                    debouncedSearch(searchParams);
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

                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">Thời gian làm việc</label>
                      <Form.Item name="level" className="mb-0">
                        <Select
                          placeholder="Chọn thời gian làm việc"
                          className="h-11 w-full"
                          allowClear
                        >
                          <Option value="FULLTIME">Toàn thời gian</Option>
                          <Option value="PARTTIME">Bán thời gian</Option>
                          <Option value="OTHER">Khác</Option>
                        </Select>
                      </Form.Item>
                    </div>

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
                      <label className="text-gray-700 font-medium mb-2 block">Trạng Thái</label>
                      <Form.Item name="status" className="mb-0">
                        <Select
                          placeholder="Chọn trạng thái"
                          className="h-11 w-full"
                          allowClear
                        >
                          <Option value={true}>Đang tuyển</Option>
                          <Option value={false}>Ngưng tuyển</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="flex items-end gap-2">
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
                        htmlType="button"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
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
                        >Làm mới</Button>
                      </Tooltip>
                    </motion.div>
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
          </Content >

          <AlertComponent
            isVisible={isAlertVisible}
            setIsVisible={setIsAlertVisible}
            type={alertMessage.type}
            message={alertMessage.message}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Xóa công việc"
            content="Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác."
          />

          <AddEditModal
            isOpen={isAddEditModalOpen}
            onClose={handleCloseAddEditModal}
            mode={modalMode}
            jobData={selectedJob}
            onSubmit={handleSubmit}
          />

          <ViewJobModal
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            jobData={selectedJob}
          />
        </Layout>
      </div>
    </Layout>
  );
};

export default JobPage;