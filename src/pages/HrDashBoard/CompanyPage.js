import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Modal, Pagination } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, EnvironmentOutlined, MailOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from 'framer-motion';
import CustomButton from '../../components/CustomButton';
import debounce from 'lodash/debounce';

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const CompanyPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState({
    name: '',
    address: '',
    email: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = useCallback(
    debounce((searchParams) => {
      fetchCompanies({
        current: 1,
        pageSize: pagination.pageSize,
        ...searchParams
      });
    }, 500),
    []
  );

  // Sửa lại phần fetchCompanies
  const fetchCompanies = async (params = {}) => {
    setLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));
      // Tạo object chứa các tham số tìm kiếm
      const searchParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      };
  
      // Chỉ thêm vào nếu có giá trị và không phải chuỗi rỗng
      if (params.name?.trim()) searchParams.name = params.name.trim();
      if (params.address?.trim()) searchParams.address = params.address.trim();
  
      const response = await companyApi.getAll(searchParams);
  
      if (response?.data?.data) {
        const { result, meta } = response.data.data;
        const dataWithKeys = result.map((item, index) => ({
          ...item,
          key: item._id,
          stt: index + 1 + ((meta.current - 1) * meta.pageSize)
        }));
        setData(dataWithKeys);
        setPagination({
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
        });
      }
    } catch (error) {
      message.error('Không thể tải danh sách công ty');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'Bạn có chắc chắn muốn xóa công ty này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
      },
      onOk: async () => {
        try {
          await companyApi.delete(id);
          message.success('Xóa công ty thành công');
          fetchCompanies(pagination);
        } catch (error) {
          message.error('Không thể xóa công ty');
          console.error('Error:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 80,
      align: "center",
      render: (_, record) => (
        <span className="text-gray-500">{record.stt}</span>
      )
    },
    {
      title: "Tên Công Ty",
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <EnvironmentOutlined className="mr-2" />
          {text}
        </div>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'left' }
      })
    },
    {
      title: "Email",
      dataIndex: ["createdBy", "email"],
      key: "email",
      render: (text) => (
        <div className="flex items-center justify-center text-gray-600">
          <MailOutlined className="mr-2" />
          {text}
        </div>
      ),
      align: "center",
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
              onClick={() => console.log('View company:', record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => console.log('Edit company:', record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSearchChange = (e, fieldName) => {
    const value = e.target.value;
    const newSearchValues = {
      ...searchValues,
      [fieldName]: value
    };
    setSearchValues(newSearchValues);

    // Gọi search với debounce
    debouncedSearch(newSearchValues);
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchCompanies({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...searchValues // Giữ lại các giá trị tìm kiếm khi chuyển trang
    });
  };

  const onFinish = (values) => {
    setSearchValues(values);
    // Gọi API với các tham số tìm kiếm
    fetchCompanies({
      current: 1, // Reset về trang 1 khi tìm kiếm
      pageSize: pagination.pageSize,
      ...values // Thêm các giá trị tìm kiếm
    });
  };
  const onReset = () => {
    form.resetFields();
    setSearchValues({
      name: '',
      address: '',
      email: ''
    });
    // Reset về trạng thái ban đầu
    fetchCompanies({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleRefresh = () => {
    fetchCompanies({
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
                Quản lý Công ty
              </motion.h1>
              <motion.p
                className="text-gray-500 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Quản lý và theo dõi thông tin các công ty đối tác
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
                    name="name"
                    label={<span className="text-gray-700 font-medium">Tên Công Ty</span>}
                  >
                    <Input
                      prefix={<SearchOutlined className="text-gray-400" />}
                      placeholder="Nhập tên công ty cần tìm"
                      className="h-11 rounded-lg"
                      onChange={(e) => handleSearchChange(e, 'name')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label={<span className="text-gray-700 font-medium">Địa chỉ</span>}
                  >
                    <Input
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                      placeholder="Nhập địa chỉ"
                      className="h-11 rounded-lg"
                      onChange={(e) => handleSearchChange(e, 'address')}
                    />
                  </Form.Item>

                  <div className="flex items-center h-full"> {/* Thêm h-full và flex items-center */}
                    <Form.Item className="mb-0 w-full"> {/* Thêm w-full */}
                      <Space size="middle" className="flex  w-full"> {/* Thêm flex justify-center và w-full */}
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
                  <Title level={4} className="!text-xl !mb-1">Danh sách Công ty</Title>
                  <p className="text-gray-500 text-sm">
                    Hiển thị {data.length} trên tổng số {pagination.total} công ty
                  </p>
                </div>
                <Space size="middle">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <CustomButton
                      htmlType="submit"
                      icon={<PlusOutlined />}
                    >
                      Thêm công ty mới
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
                  dataSource={data}
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

export default CompanyPage;