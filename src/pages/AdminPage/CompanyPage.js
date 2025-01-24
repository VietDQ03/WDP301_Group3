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
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      key: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Manager",
      status: "Inactive",
    },
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      align: "center",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          style={{
            color: status === "Active" ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
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
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              shape="round"
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
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

        <Content className="p-6">
          <div className="bg-white p-8 shadow rounded-lg">
            {/* Search Form */}
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="mb-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="name" label="Name">
                  <Input placeholder="Enter name" style={{ height: "40px" }} />
                </Form.Item>

                <Form.Item name="address" label="Address">
                  <Input
                    placeholder="Enter address"
                    style={{ height: "40px" }}
                  />
                </Form.Item>

                <Form.Item>
                  <div className="flex space-x-2 mt-7" style={{ marginTop: "35px" }}>
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
              <Title level={4} style={{ margin: 0 }}>
                Company List
              </Title>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  shape="round"
                  size="middle"
                >
                  Add New
                </Button>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    shape="round"
                    size="middle"
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
              dataSource={dataSource}
              columns={columns}
              pagination={{
                total: dataSource.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `1-10 of ${total} rows`,
              }}
              bordered
              rowClassName="hover:bg-gray-50"
              size="middle"
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyPage;
