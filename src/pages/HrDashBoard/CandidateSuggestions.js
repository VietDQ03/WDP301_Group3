import React, { useCallback, useEffect, useState } from "react";
import { Layout, Table, Button, Space, Typography, Tooltip, Select, Tag, message, Pagination, Input } from "antd";
import { ReloadOutlined, FileTextOutlined, UserOutlined, EyeOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { cvAPI } from '../../api/cvAPI';
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import ViewCandidateModal from "./Modal/ViewCandidateModal";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const CandidateSuggestions = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [searchValues, setSearchValues] = useState({
    email: '',
    userId: '',
    status: undefined,
    experience: undefined
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchCVs = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
  
      const queryParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...(params.status && { status: params.status }),
        ...(params.email && { email: params.email }),
        ...(params.userId && { userId: params.userId }),
        ...(params.experience && { experience: params.experience })
      };
  
      const response = await cvAPI.getAll(queryParams);
      const { result, meta } = response?.data;
  
      // Lọc chỉ lấy các CV có isActive là true
      const activeCVs = result.filter(cv => cv.isActive === true);
  
      const formattedCVs = activeCVs.map((cv, index) => ({
        key: cv._id,
        stt: ((meta.current - 1) * meta.pageSize) + index + 1,
        userId: cv.user_id,
        position: cv.position.join(', '),
        skill: cv.skill.join(', '),
        experience: cv.experience,
        status: cv.isActive ? "ACTIVE" : "INACTIVE",
        url: cv.url,
        createdAt: new Date(cv.createdAt).toLocaleString(),
        updatedAt: new Date(cv.updatedAt).toLocaleString(),
      }));
  
      setCvList(formattedCVs);
      setPagination({
        current: meta.current,
        pageSize: meta.pageSize,
        total: activeCVs.length, // Cập nhật tổng số lượng CV active
      });
    } catch (error) {
      console.error("Error fetching CVs:", error);
      message.error("Có lỗi xảy ra khi tải danh sách CV!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchParams) => {
      fetchCVs({
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

  const handleViewCV = (record) => {
    setSelectedCV(record);
    setIsViewModalOpen(true);
  };

  const handleReset = () => {
    setSearchValues({
      email: '',
      userId: '',
      status: undefined,
      experience: undefined
    });

    fetchCVs({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleRefresh = () => {
    fetchCVs({
      ...searchValues,
      current: pagination.current,
      pageSize: pagination.pageSize
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
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (text) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          <span>#{text.slice(-6)}</span>
        </div>
      ),
    },
    {
      title: "Vị trí ứng tuyển",
      dataIndex: "position",
      key: "position",
      render: (text) => (
        <div className="flex flex-wrap gap-1">
          {text.split(',').map((pos, index) => (
            <Tag key={index} color="purple" className="m-1">
              {pos.trim()}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: "Kỹ năng",
      dataIndex: "skill",
      key: "skill",
      render: (skills) => (
        <div className="flex flex-wrap gap-1">
          {skills.split(',').map((skill, index) => (
            <Tag key={index} color="blue" className="m-1">
              {skill.trim()}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
      width: 150,
      align: "center",
      render: (experience) => (
        <div className="flex items-center justify-center">
          <Tag color="orange">
            {experience ? `${experience} năm` : 'Chưa có KN'}
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      )
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem CV">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleViewCV(record)}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <Layout className="min-h-screen flex flex-row">
      <div className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'} flex-shrink-0`}>
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
                  Quản lý CV
                </motion.h1>
                <motion.p
                  className="text-gray-500 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Quản lý và theo dõi CV của ứng viên
                </motion.p>
              </div>

              <motion.div
                className="bg-white p-6 shadow-sm rounded-xl mb-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">User ID</label>
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="Nhập User ID"
                      className="h-11 rounded-lg"
                      value={searchValues.userId}
                      onChange={(e) => handleInputChange('userId', e.target.value)}
                      allowClear
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Email</label>
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Nhập email"
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
                      className="w-full h-11"
                      value={searchValues.status}
                      onChange={(value) => handleInputChange('status', value)}
                      allowClear
                    >
                      <Option value="ACTIVE">Hoạt động</Option>
                      <Option value="INACTIVE">Không hoạt động</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Kinh nghiệm</label>
                    <Select
                      placeholder="Chọn kinh nghiệm"
                      className="w-full h-11"
                      value={searchValues.experience}
                      onChange={(value) => handleInputChange('experience', value)}
                      allowClear
                    >
                      <Option value="0">Chưa có kinh nghiệm</Option>
                      <Option value="1">1 năm</Option>
                      <Option value="2">2 năm</Option>
                      <Option value="3">3 năm</Option>
                      <Option value="4">4 năm</Option>
                      <Option value="5">5 năm</Option>
                      <Option value="more">Trên 5 năm</Option>
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
                    <Title level={4} className="!text-xl !mb-1">Danh sách CV</Title>
                    <p className="text-gray-500 text-sm">
                      Hiển thị {cvList.length} trên tổng số {pagination.total} CV
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

                <div className="pb-16">
                  <Table
                    dataSource={cvList}
                    columns={columns}
                    pagination={false}
                    loading={loading}
                    className="shadow-sm rounded-lg overflow-hidden"
                    rowClassName={() => 'hover:bg-gray-50 transition-colors'}
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
                      fetchCVs({
                        ...searchValues,
                        current: page,
                        pageSize: pageSize
                      });
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </Content>

          <ViewCandidateModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedCV(null);
            }}
            cvData={selectedCV}
          />
        </Layout>
      </div>
    </Layout>
  );
};

export default CandidateSuggestions;