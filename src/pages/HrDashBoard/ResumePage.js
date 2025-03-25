import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import { Table, Input, Button, Space, Typography, Tooltip, Layout, Select, message, Pagination, Modal } from "antd";
import { ReloadOutlined, MailOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { Briefcase } from 'lucide-react';
import ViewResumeModal from './Modal/ViewResumeModal';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ResumePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchValues, setSearchValues] = useState({
    email: '',
    username: '',
    status: undefined
  });

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    id: null,
    currentStatus: null,
    newStatus: null,
    title: '',
    content: ''
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { user } = useSelector((state) => state.auth);

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': 'Đang chờ',
      'PASSCV': 'Chờ phỏng vấn',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối'
    };
    return statusMap[status] || status;
  };

  const getConfirmationMessage = (currentStatus, newStatus) => {
    const messages = {
      PENDING_TO_PASSCV: {
        title: 'Xác nhận chuyển trạng thái',
        content: 'Bạn có chắc chắn muốn chuyển hồ sơ này sang trạng thái "Chờ phỏng vấn"? Sau khi chuyển, bạn không thể quay lại trạng thái trước đó.'
      },
      PENDING_TO_REJECTED: {
        title: 'Xác nhận từ chối hồ sơ',
        content: 'Bạn có chắc chắn muốn từ chối hồ sơ này? Hành động này không thể hoàn tác.'
      },
      PASSCV_TO_APPROVED: {
        title: 'Xác nhận duyệt hồ sơ',
        content: 'Bạn có chắc chắn muốn duyệt hồ sơ này? Sau khi duyệt, trạng thái không thể thay đổi.'
      },
      PASSCV_TO_REJECTED: {
        title: 'Xác nhận từ chối hồ sơ',
        content: 'Bạn có chắc chắn muốn từ chối hồ sơ này? Hành động này không thể hoàn tác.'
      }
    };

    const key = `${currentStatus}_TO_${newStatus}`;
    return messages[key] || {
      title: 'Xác nhận thay đổi',
      content: `Bạn có chắc chắn muốn thay đổi trạng thái từ "${getStatusLabel(currentStatus)}" sang "${getStatusLabel(newStatus)}"?`
    };
  };

  const fetchResumes = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const queryParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...(params.status && { status: params.status }),
        ...(params.email && { email: params.email }),
        ...(params.username && { username: params.username })
      };

      if (params.email?.trim()) {
        queryParams.email = params.email.trim();
      }

      if (params.username?.trim()) {
        queryParams.username = params.username.trim();
      }

      if (params.status && params.status !== '') {
        queryParams.status = params.status;
      }

      const response = await resumeApi.findByCompany(
        user.company._id,
        queryParams
      );

      const resumeData = response?.data?.data;

      if (resumeData?.result) {
        const formattedResumes = resumeData.result.map((resume, index) => ({
          key: resume._id,
          stt: index + 1 + ((resumeData.meta.current - 1) * resumeData.meta.pageSize),
          id: resume._id,
          email: resume.email,
          url: resume.url,
          status: resume.status,
          companyId: resume.companyId,
          userName: resume.userName,
          jobName: resume.jobName,
          description: resume.description,
          createdBy: resume.createdBy,
          createdAt: new Date(resume.createdAt).toLocaleString(),
          updatedAt: new Date(resume.updatedAt).toLocaleString(),
          history: resume.history || []
        }));

        setResumes(formattedResumes);
        setPagination({
          current: resumeData.meta.current,
          pageSize: resumeData.meta.pageSize,
          total: resumeData.meta.total,
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

  const debouncedSearch = useCallback(
    debounce((searchParams) => {
      fetchResumes({
        ...searchParams,
        current: 1
      });
    }, 500),
    []
  );

  const handleInputChange = (field, value) => {
    const newSearchValues = {
      ...searchValues,
      [field]: value
    };
    setSearchValues(newSearchValues);

    debouncedSearch({
      ...newSearchValues,
      pageSize: pagination.pageSize
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchResumes({
      ...searchValues,
      current: page,
      pageSize: pageSize
    });
  };

  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
        return [
          { value: 'PENDING', label: 'Đang chờ', color: 'text-yellow-500' },
          { value: 'PASSCV', label: 'Chờ phỏng vấn', color: 'text-amber-500' },
          { value: 'REJECTED', label: 'Từ chối', color: 'text-rose-500' }
        ];
      case 'PASSCV':
        return [
          { value: 'PASSCV', label: 'Chờ phỏng vấn', color: 'text-amber-500' },
          { value: 'APPROVED', label: 'Đã duyệt', color: 'text-green-500' },
          { value: 'REJECTED', label: 'Từ chối', color: 'text-rose-500' }
        ];
      case 'APPROVED':
        return [
          { value: 'APPROVED', label: 'Đã duyệt', color: 'text-green-500' }
        ];
      case 'REJECTED':
        return [
          { value: 'REJECTED', label: 'Từ chối', color: 'text-rose-500' }
        ];
      default:
        return [];
    }
  };

  const showConfirmModal = (id, currentStatus, newStatus) => {
    const message = getConfirmationMessage(currentStatus, newStatus);
    setConfirmModal({
      visible: true,
      id,
      currentStatus,
      newStatus,
      title: message.title,
      content: message.content
    });
  };

  const handleUpdateStatus = async (id, newStatus, currentStatus) => {
    const allowedStatuses = getAvailableStatuses(currentStatus).map(s => s.value);
    if (!allowedStatuses.includes(newStatus)) {
      message.error('Không thể chuyển sang trạng thái này');
      return;
    }

    showConfirmModal(id, currentStatus, newStatus);
  };

  const handleConfirmStatusUpdate = async () => {
    const { id, newStatus } = confirmModal;
    setConfirmModal(prev => ({ ...prev, visible: false }));
    
    try {
      setLoading(true);
      await resumeApi.updateStatus(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
      fetchResumes({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...searchValues
      });
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedResume(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center"
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
      dataIndex: "userName",
      key: "userName",
      render: (userName) => (
        <div className="flex items-center justify-center font-medium text-gray-800">
          <UserOutlined className="mr-2" />
          {userName || 'N/A'}
        </div>
      ),
    },
    {
      title: "Công Việc",
      align: "center",
      dataIndex: "jobName",
      key: "jobName",
      width: 250,
      render: (jobName) => (
        <div className="flex items-center justify-center text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          {jobName || 'N/A'}
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
          className="w-40"
          onChange={(newStatus) => handleUpdateStatus(record.id, newStatus, status)}
          disabled={status === 'APPROVED' || status === 'REJECTED'}
        >
          {getAvailableStatuses(status).map(statusOption => (
            <Option key={statusOption.value} value={statusOption.value}>
              <span className={statusOption.color}>
                {statusOption.label}
              </span>
            </Option>
          ))}
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
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const handleReset = () => {
    setSearchValues({
      email: '',
      username: '',
      status: undefined
    });

    fetchResumes({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleRefresh = () => {
    fetchResumes({
      ...searchValues,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
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

              <motion.div
                className="bg-white p-6 shadow-sm rounded-xl mb-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Email</label>
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Nhập email ứng viên"
                      className="h-11 rounded-lg"
                      value={searchValues.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      allowClear
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Tên người dùng</label>
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="Nhập tên người dùng"
                      className="h-11 rounded-lg"
                      value={searchValues.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      allowClear
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Trạng thái</label>
                    <Select
                      placeholder="Chọn trạng thái"
                      className="h-11 w-full"
                      value={searchValues.status}
                      onChange={(value) => handleInputChange('status', value)}
                      allowClear
                    >
                      <Option value="PENDING">
                        <span className="text-yellow-500">Đang chờ</span>
                      </Option>
                      <Option value="PASSCV">
                        <span className="text-amber-500">Chờ phỏng vấn</span>
                      </Option>
                      <Option value="APPROVED">
                        <span className="text-green-500">Đã duyệt</span>
                      </Option>
                      <Option value="REJECTED">
                        <span className="text-rose-500">Từ chối</span>
                      </Option>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleReset}
                      size="large"
                      className="h-11 px-6 flex items-center"
                      icon={<ReloadOutlined />}
                    >
                      Đặt lại
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 relative min-h-[600px]"
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
                      <Tooltip title="Làm mới dữ liệu">
                        <Button
                          icon={<ReloadOutlined />}
                          onClick={handleRefresh}
                          size="large"
                          className="h-11 hover:bg-gray-50 hover:border-gray-300"
                        >
                          Làm mới
                        </Button>
                      </Tooltip>
                    </motion.div>
                  </Space>
                </div>

                <div className="pb-16 overflow-x-auto">
                  <Table
                    dataSource={resumes}
                    columns={columns}
                    pagination={false}
                    className="shadow-sm rounded-lg overflow-hidden"
                    loading={loading}
                    rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
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
                      handlePaginationChange(page, pageSize);
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </Content>
        </Layout>
      </div>

      <Modal
        title={<span className="font-medium">{confirmModal.title}</span>}
        open={confirmModal.visible}
        onOk={handleConfirmStatusUpdate}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
        okText="Xác nhận"
        cancelText="Hủy"
        className="modal-confirm"
      >
        <div className="py-4">
          <p className="text-gray-600">{confirmModal.content}</p>
        </div>
      </Modal>

      <ViewResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeData={selectedResume}
      />
    </Layout>
  );
};

export default ResumePage;