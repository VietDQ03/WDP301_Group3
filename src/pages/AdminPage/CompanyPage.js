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
  const [filteredData, setFilteredData] = useState([]);
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

  useEffect(() => {
    handleSearch(searchValues);
  }, [searchValues, data]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyApi.getAll();
      if (response.data && response.data.result) {
        const dataWithKeys = response.data.result.map((item, index) => ({
          ...item,
          key: item._id || index.toString(),
        }));
        setData(dataWithKeys);
        setFilteredData(dataWithKeys);
        setPagination({
          ...pagination,
          total: dataWithKeys.length,
        });
      }
    } catch (error) {
      message.error('Failed to fetch companies');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSearch = (values) => {
    let filtered = [...data];

    if (values.name) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(values.name.toLowerCase())
      );
    }

    if (values.address) {
      filtered = filtered.filter(item => 
        item.address?.toLowerCase().includes(values.address.toLowerCase())
      );
    }

    if (values.email) {
      filtered = filtered.filter(item => 
        item.createdBy?.email?.toLowerCase().includes(values.email.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setPagination({
      ...pagination,
      current: 1,
      total: filtered.length,
    });
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

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
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
    setFilteredData(data);
    setPagination({
      ...pagination,
      current: 1,
      total: data.length,
    });
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
                    onClick={fetchCompanies}
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
              dataSource={filteredData}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total) => `Tìm thấy ${total} công ty `,
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