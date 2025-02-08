import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { userApi } from "../../api/AdminPageAPI/userAPI";
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

const UserPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await userApi.getAll({
        page: params.current || 1,
        pageSize: params.pageSize || 10,
        name: params.name,
        email: params.email,
      });

      setUsers(response.data.results.map((user, index) => ({
        key: index + 1,
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleString(),
        updatedAt: new Date(user.updatedAt).toLocaleString(),
      })));

      setPagination({
        ...params,
        total: response.data.total,
      });
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({
      current: 1,
      pageSize: 10,
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await userApi.delete(id);
      message.success('User deleted successfully');
      fetchUsers(pagination);
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      ...newPagination,
      ...form.getFieldsValue(),
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      width: 70,
      className: "text-center",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      className: "text-center",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => {
                // Handle edit logic here
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
  ];

  const onFinish = (values) => {
    fetchUsers({
      ...pagination,
      current: 1,
      ...values,
    });
  };

  const onReset = () => {
    form.resetFields();
    fetchUsers({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleRefresh = () => {
    fetchUsers(pagination);
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item name="name" label="Name" className="col-span-1">
                  <Input placeholder="Enter name" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="email" label="Email" className="col-span-1">
                  <Input placeholder="Enter email" style={{height: '40px'}}/>
                </Form.Item>

                <Form.Item className="col-span-1" style={{ marginBottom: 0, marginTop: '35px' }}>
                  <div className="flex space-x-2">
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                    <Button onClick={onReset}>Reset</Button>
                  </div>
                </Form.Item>
              </div>
            </Form>

            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                User List
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Add New
                </Button>
                <Tooltip title="Refresh">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
                <Tooltip title="Settings">
                  <Button icon={<SettingOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <Table
              dataSource={users}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
              }}
              onChange={handleTableChange}
              bordered
              size="middle"
              className="overflow-x-auto"
              loading={loading}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPage;