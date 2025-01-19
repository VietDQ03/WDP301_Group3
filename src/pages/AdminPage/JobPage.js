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

const JobPage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      stt: 1,
      title: "Junior",
      salary: "20,000,000 đ",
      level: "JUNIOR",
      status: "ACTIVE",
      createdAt: "25-06-2024 15:58:12",
      updatedAt: "05-12-2024 09:06:40"
    },
    {
      key: "2",
      stt: 2,
      title: "Junior Frontend ReactJS Dev (JavaScript, HTML, CSS)",
      salary: "17,000,000 đ",
      level: "JUNIOR",
      status: "ACTIVE",
      createdAt: "13-06-2023 10:54:27",
      updatedAt: "13-06-2023 10:54:27"
    },
    {
      key: "3",
      stt: 3,
      title: "Front-end coder",
      salary: "15,000,000 đ",
      level: "FRESHER",
      status: "ACTIVE",
      createdAt: "13-06-2023 10:53:18",
      updatedAt: "13-06-2023 10:53:18"
    },
    {
      key: "4",
      stt: 4,
      title: "Mid/Sr Frontend Developer (ReactJS, TypeScript)",
      salary: "25,000,000 đ",
      level: "MIDDLE",
      status: "ACTIVE",
      createdAt: "13-06-2023 10:52:17",
      updatedAt: "13-06-2023 10:52:17"
    },
    {
      key: "5",
      stt: 5,
      title: "Remote Sr Front-End Dev (TypeScript, ReactJS, English)",
      salary: "30,000,009 đ",
      level: "MIDDLE",
      status: "ACTIVE",
      createdAt: "13-06-2023 10:51:06",
      updatedAt: "13-06-2023 10:51:06"
    }
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      className: "text-center",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Tên Job",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => {
        const aValue = parseInt(a.salary.replace(/[^\d]/g, ''));
        const bValue = parseInt(b.salary.replace(/[^\d]/g, ''));
        return aValue - bValue;
      },
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      sorter: (a, b) => a.level.localeCompare(b.level),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
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
                <Form.Item name="title" label="Tên Job" className="col-span-1">
                  <Input placeholder="Nhập tên job" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="level" label="Level" className="col-span-1">
                  <Select placeholder="Chọn level" style={{height: '40px'}}>
                    <Option value="FRESHER">FRESHER</Option>
                    <Option value="JUNIOR">JUNIOR</Option>
                    <Option value="MIDDLE">MIDDLE</Option>
                    <Option value="SENIOR">SENIOR</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" className="col-span-1">
                  <Select placeholder="Chọn trạng thái" style={{height: '40px'}}>
                    <Option value="ACTIVE">ACTIVE</Option>
                    <Option value="INACTIVE">INACTIVE</Option>
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
                Danh sách Jobs
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

export default JobPage;