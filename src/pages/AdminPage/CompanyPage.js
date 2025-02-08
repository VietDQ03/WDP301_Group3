import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import {
  Table,
  Input,
  Button,
  Space,
  Form,
  Typography,
  Tooltip,
  Layout,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (page = pagination.current) => {
    setLoading(true);
    try {
      const response = await companyApi.getAll({
        page: page,
        pageSize: 10
      });
      
      console.log("Raw response:", response);
      console.log("Data structure:", response?.data?.data);
      
      if (response?.data?.data) {
        const { result, meta } = response.data.data;
        console.log("Extracted result:", result);
        console.log("Extracted meta:", meta);
        
        const dataWithKeys = result.map((item) => ({
          ...item,
          key: item._id,
        }));
        console.log("Processed data:", dataWithKeys);
        
        setData(dataWithKeys);
        setPagination({
          current: page,
          pageSize: 10,
          total: meta.total || 0,
        });
      }
    } catch (error) {
      message.error('Failed to fetch companies');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      const response = await companyApi.search({
        page: 1,
        pageSize: 10,
        ...values
      });
      
      if (response?.data?.data) {
        const { result, meta } = response.data.data;
        const dataWithKeys = result.map((item) => ({
          ...item,
          key: item._id,
        }));
        setData(dataWithKeys);
        setPagination({
          current: 1,
          pageSize: 10,
          total: meta.total || 0,
        });
      }
    } catch (error) {
      message.error('Failed to search companies');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setSearchValues(prev => ({
      ...prev,
      [field]: value
    }));
    form.setFieldsValue({ [field]: value });
  };

  const handleDelete = async (id) => {
    try {
      await companyApi.delete(id);
      message.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      message.error('Failed to delete company');
      console.error('Error:', error);
    }
  };

  const handleTableChange = (newPagination) => {
    console.log("Table pagination change:", newPagination); // Debug log
    fetchCompanies(newPagination.current);
  };

  const onFinish = (values) => {
    handleSearch(values);
  };

  const onReset = () => {
    form.resetFields();
    setSearchValues({
      name: '',
      address: '',
      email: ''
    });
    fetchCompanies(1);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      width: 70,
      render: (_, __, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Tên Công Ty",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: ["createdBy", "email"],
      key: "email",
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              shape="round"
              size="small"
              onClick={() => {
                console.log('Edit record:', record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              shape="round"
              size="small"
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="p-6">
          <div className="bg-white p-8 shadow rounded-lg">
            {/* Search Form */}
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item name="name" label="Tên Công Ty">
                  <Input
                    placeholder="Nhập tên công ty"
                    style={{ height: "40px" }}
                    value={searchValues.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="address" label="Địa chỉ">
                  <Input
                    placeholder="Nhập địa chỉ"
                    style={{ height: "40px" }}
                    value={searchValues.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="email" label="Email">
                  <Input
                    placeholder="Nhập email"
                    style={{ height: "40px" }}
                    value={searchValues.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <div className="flex space-x-2" style={{ marginTop: "35px" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Tìm kiếm
                    </Button>
                    <Button onClick={onReset}>Làm mới</Button>
                  </div>
                </Form.Item>
              </div>
            </Form>

            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }}>
                Danh sách Công Ty
              </Title>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  shape="round"
                  size="middle"
                  onClick={() => {
                    console.log('Add new company');
                  }}
                >
                  Thêm Mới
                </Button>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    shape="round"
                    size="middle"
                    onClick={() => fetchCompanies(1)}
                    loading={loading}
                  />
                </Tooltip>
                <Tooltip title="Settings">
                  <Button
                    icon={<SettingOutlined />}
                    shape="round"
                    size="middle"
                  />
                </Tooltip>
              </Space>
            </div>

            {/* Table */}
            <Table
              dataSource={data}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: false,
                showTotal: (total) => `Tổng số ${total} công ty`,
              }}
              onChange={handleTableChange}
              bordered
              rowClassName="hover:bg-gray-50"
              size="middle"
              loading={loading}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyPage;