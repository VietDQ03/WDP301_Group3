import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { resumeApi } from "../../api/AdminPageAPI/resumeAPI";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { Table, Input, Button, Space, Typography, Tooltip, Layout, Select, message, Pagination, Modal } from "antd";
import { ReloadOutlined, MailOutlined, EyeOutlined, UserOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce, max } from "lodash";
import { useSelector } from "react-redux";
import { Briefcase } from 'lucide-react';
import ViewResumeModal from '../HrDashBoard/Modal/ViewResumeModal';
import { jobApi } from "../../api/AdminPageAPI/jobAPI";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const ResumePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [searchValues, setSearchValues] = useState({
    email: '',
    username: '',
    status: undefined
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { user } = useSelector((state) => state.auth);

  const fetchResumes = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...(params.status && { status: params.status }),
        ...(params.email && { email: params.email.trim() }),
        ...(params.username && { username: params.username.trim() })
      };
  
      let response;
      if (user.role === 'HR' && user.company?._id) {
        response = await resumeApi.findByCompany(user.company._id, queryParams);
      } else {
        response = await resumeApi.search(queryParams);
      }
  
      const resumeData = response?.data;
      if (resumeData?.result) {
        const formattedResumes = await Promise.all(resumeData.result.map(async (resume, index) => {
          let jobName = 'N/A';
          let userName = 'N/A';

          if (resume.companyId) {
            try {
              const jobResponse = await jobApi.getOne(resume.jobId);
              jobName = jobResponse?.name || 'N/A';
            } catch (err) {
              console.error(`Lỗi khi lấy tên công ty cho resume ${resume._id}:`, err);
            }
          }

          if (resume.userId) {
            try {
              const userResponse = await userApi.getOne(resume.userId);
              userName = userResponse?.name || 'N/A';
            } catch (err) {
              console.error(`Lỗi khi lấy tên người dùng cho resume ${resume._id}:`, err);
            }
          }
  
          return {
            key: resume._id,
            stt: index + 1 + ((resumeData.meta.current - 1) * resumeData.meta.pageSize),
            id: resume._id,
            email: resume.email,
            url: resume.url,
            status: resume.status,
            companyId: resume.companyId || 'N/A',
            userName,
            jobName,
            description: resume.description,
            createdBy: resume.createdBy,
            createdAt: new Date(resume.createdAt).toLocaleString(),
            updatedAt: new Date(resume.updatedAt).toLocaleString(),
            history: resume.history || []
          };
        }));
  
        setResumes(formattedResumes);
        setPagination({
          current: resumeData.meta.current,
          pageSize: resumeData.meta.pageSize,
          total: resumeData.meta.total,
        });
      }
    } catch (error) {
      console.error("Lỗi khi fetch resumes:", error);
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

  const handleDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa thư ứng tuyển này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await resumeApi.delete(id);
          message.success("Xóa thư ứng tuyển thành công!");
          fetchResumes({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        } catch (error) {
          console.error("Error deleting resumes:", error);
          message.error("Có lỗi xảy ra khi xóa resumes!");
        }
      },
    });
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
    // {
    //   title: "Hồ sơ",
    //   key: "resume",
    //   align: "center",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Tooltip title="Xem hồ sơ">
    //         <a
    //           href={`${process.env.REACT_APP_BASE_URL}/images/resume/${record?.url}`}
    //           target="_blank"
    //           className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
    //         >
    //           <EyeOutlined className="text-xl" />
    //         </a>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
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
      render: (status) => {
        let color = "gray";
        let text = "Không xác định";
        if (status === "PENDING") {
          color = "yellow-500";
          text = "Đang chờ";
        } else if (status === "APPROVED") {
          color = "green-500";
          text = "Đã duyệt";
        } else if (status === "REJECTED") {
          color = "rose-500";
          text = "Từ chối";
        }
        return <span className={`text-${color} font-medium`}>{text}</span>;
      },
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
                        >Làm mới</Button>
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
                    onRow={(record) => ({
                      onClick: () => {
                      },
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
                      handlePaginationChange(page, pageSize);
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default ResumePage;