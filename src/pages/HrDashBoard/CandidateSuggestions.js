import React, { useCallback, useEffect, useState } from "react";
import { Layout, Button, Space, Typography, Tooltip, Tag, message, Pagination, Select, Table } from "antd";
import { ReloadOutlined, FileTextOutlined, UserOutlined, EyeOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { cvAPI } from '../../api/cvAPI';
import { skillApi } from '../../api/skillAPI';
import { positionApi } from '../../api/positionAPI';
import { experienceApi } from '../../api/experienceAPI';
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
  const [positions, setPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [searchValues, setSearchValues] = useState({
    position: [],
    skill: [],
    experience: []
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchSelectOptions = async () => {
    try {
      const [positionRes, skillRes, experienceRes] = await Promise.all([
        positionApi.getAll({ pageSize: 100 }),
        skillApi.getAll({ pageSize: 100 }),
        experienceApi.getAll({ pageSize: 100 })
      ]);

      setPositions(positionRes.data.result);
      setSkills(skillRes.data.result);
      setExperiences(experienceRes.data.result);
    } catch (error) {
      console.error("Error fetching options:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
  };

  const fetchCVs = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const queryParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...(params.position && { position: params.position }),
        ...(params.skill && { skill: params.skill }),
        ...(params.experience && { experience: params.experience })
      };

      const response = await cvAPI.getAll(queryParams);
      const { result, meta } = response?.data;

      const activeCVs = result.filter(cv => cv.isActive === true);

      const formattedCVs = activeCVs.map((cv, index) => ({
        key: cv._id,
        stt: ((meta.current - 1) * meta.pageSize) + index + 1,
        userName: cv.user_id.name,
        userEmail: cv.user_id.email,
        position: cv.position.map(p => p.name).join(', '),
        skill: cv.skill.map(s => s.name).join(', '),
        experience: cv.experience.name,
        url: cv.url,
        createdAt: new Date(cv.createdAt).toLocaleString(),
        updatedAt: new Date(cv.updatedAt).toLocaleString(),
        _id: cv._id,
        user_id: cv.user_id,
        position_original: cv.position,
        skill_original: cv.skill,
        experience_original: cv.experience,
        isActive: cv.isActive,
        isDeleted: cv.isDeleted,
        description: cv.description
      }));

      setCvList(formattedCVs);
      setPagination({
        current: meta.current,
        pageSize: meta.pageSize,
        total: activeCVs.length,
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
    fetchSelectOptions();
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
    if (record) {
      console.log("CV Data for modal:", record);
      setSelectedCV(record);
      setIsViewModalOpen(true);
    }
  };

  const handleReset = () => {
    setSearchValues({
      position: [],
      skill: [],
      experience: []
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
      title: "Họ và tên",
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
      render: (text) => (
        <div className="flex items-center">
          <MailOutlined className="mr-2" />
          <span>{text}</span>
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
            {experience}
          </Tag>
        </div>
      ),
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Vị trí ứng tuyển</label>
                    <Select
                      placeholder="Chọn vị trí ứng tuyển"
                      className="w-full h-11"
                      value={searchValues.position}
                      onChange={(value) => handleInputChange('position', value)}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {positions.map(pos => (
                        <Option key={pos._id} value={pos._id}>{pos.name}</Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">Kỹ năng</label>
                    <Select
                      placeholder="Chọn kỹ năng"
                      className="w-full h-11"
                      value={searchValues.skill}
                      onChange={(value) => handleInputChange('skill', value)}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {skills.map(skill => (
                        <Option key={skill._id} value={skill._id}>{skill.name}</Option>
                      ))}
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
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {experiences.map(exp => (
                        <Option key={exp._id} value={exp._id}>{exp.name}</Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleReset}
                      size="large"
                      className="h-11 px-6 flex items-center w-full"
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