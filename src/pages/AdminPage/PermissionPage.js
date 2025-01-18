import React from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import {
  Table,
  Input,
  Button,
  Space,
  Form,
  Typography,
  Tooltip,
  Layout,
  Select,
  Tag,
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
const { Option } = Select;

const PermissionPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      id: "648ad511dafdb9754f40b868",
      name: "Fetch resume with paginate",
      api: "/api/v1/resumes",
      method: "GET",
      module: "RESUMES",
      createdAt: "15-06-2023 16:08:33",
      updatedAt: "05-12-2024 13:58:07"
    },
    {
      key: "2",
      id: "648ad53bdafdb9754f40b872",
      name: "Delete a resume",
      api: "/api/v1/resumes/id",
      method: "DELETE",
      module: "RESUMES",
      createdAt: "15-06-2023 16:09:15",
      updatedAt: "05-12-2024 13:58:01"
    },
    {
      key: "3",
      id: "648ad555dafdb9754f40b877",
      name: "Update resume status",
      api: "/api/v1/resumes/id",
      method: "PATCH",
      module: "RESUMES",
      createdAt: "15-06-2023 16:09:41",
      updatedAt: "05-12-2024 13:57:56"
    },
    {
      key: "4",
      id: "648ad522dafdb9754f40b86d",
      name: "Get resume by id",
      api: "/api/v1/resumes/id",
      method: "GET",
      module: "RESUMES",
      createdAt: "15-06-2023 16:08:50",
      updatedAt: "05-12-2024 13:57:48"
    }
  ];

  const methodColors = {
    GET: 'blue',
    POST: 'green',
    PATCH: 'orange',
    DELETE: 'red'
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      className: "text-blue-500",
      render: (text) => <a href="#">{text}</a>,
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "API",
      dataIndex: "api",
      key: "api",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <Tag color={methodColors[method] || 'default'}>
          {method}
        </Tag>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
            />
          </Tooltip>
        </Space>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    }
  ];

  const onFinish = (values) => {
    console.log("Search values:", values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          <div className="bg-white p-6 shadow rounded-lg">
            {/* Search Form */}
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Form.Item name="name" label="Name" className="col-span-1">
                  <Input placeholder="Enter name" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="api" label="API" className="col-span-1">
                  <Input placeholder="Enter API" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="method" label="Method" className="col-span-1">
                  <Select placeholder="Select method" style={{height: '40px'}}>
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PATCH">PATCH</Option>
                    <Option value="DELETE">DELETE</Option>
                  </Select>
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

            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                Danh sách Permissions (Quyền Hạn)
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm mới
                </Button>
                <Tooltip title="Refresh">
                  <Button icon={<ReloadOutlined />} />
                </Tooltip>
                <Tooltip title="Settings">
                  <Button icon={<SettingOutlined />} />
                </Tooltip>
              </Space>
            </div>

            {/* Table */}
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                total: dataSource.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `1-${Math.min(10, total)} of ${total} rows`,
              }}
              bordered
              size="middle"
              className="overflow-x-auto"
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PermissionPage;