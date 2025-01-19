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

const RolePage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      id: "67566b60671f5436a0de69a5",
      name: "HR_ROLE",
      status: "INACTIVE",
      createdAt: "09-12-2024 11:00:32",
      updatedAt: "09-12-2024 11:00:32"
    },
    {
      key: "2",
      id: "667b80556769438baa810147",
      name: "NORMAL_USER",
      status: "ACTIVE",
      createdAt: "26-06-2024 09:43:33",
      updatedAt: "05-12-2024 09:55:56"
    },
    {
      key: "3",
      id: "667b80556769438baa810146",
      name: "SUPER_ADMIN",
      status: "ACTIVE",
      createdAt: "26-06-2024 09:43:33",
      updatedAt: "05-12-2024 00:01:34"
    }
  ];

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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="name" label="Name" className="col-span-1">
                  <Input placeholder="Enter role name" style={{height: '40px'}} />
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
                Danh sách Roles (Vai Trò)
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
                showTotal: (total) => `1-${total} of ${total} rows`,
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

export default RolePage;