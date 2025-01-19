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

const ResumePage = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [form] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      id: "67514f1f10e9c3be04999bd5",
      status: "PENDING",
      job: "Junior",
      company: "Tiktok",
      createdAt: "05-12-2024 13:58:39",
      updatedAt: "05-12-2024 13:58:39"
    },
    {
      key: "2",
      id: "667b998810ecd6187bf2aece",
      status: "PENDING",
      job: "Junior",
      company: "Tiktok",
      createdAt: "26-06-2024 11:31:04",
      updatedAt: "26-06-2024 11:31:04"
    },
    {
      key: "3",
      id: "667b92b646c705d2954c20d9",
      status: "PENDING",
      job: "Junior",
      company: "Tiktok",
      createdAt: "26-06-2024 11:01:58",
      updatedAt: "26-06-2024 11:01:58"
    },
    {
      key: "4",
      id: "667a9bb812120ff7945a83c",
      status: "PENDING",
      job: "Junior Frontend ReactJS Dev (JavaScript, HTML, CSS)",
      company: "Tiktok",
      createdAt: "25-06-2024 17:28:08",
      updatedAt: "25-06-2024 17:28:08"
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
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "orange" : "green"}>
          {status}
        </Tag>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Job",
      dataIndex: "job",
      key: "job",
      sorter: (a, b) => a.job.localeCompare(b.job),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      sorter: (a, b) => a.company.localeCompare(b.company),
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
                <Form.Item name="job" label="Job" className="col-span-1">
                  <Input placeholder="Nhập tên job" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="company" label="Company" className="col-span-1">
                  <Input placeholder="Nhập tên công ty" style={{height: '40px'}} />
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" className="col-span-1">
                  <Select placeholder="Chọn trạng thái" style={{height: '40px'}}>
                    <Option value="PENDING">PENDING</Option>
                    <Option value="APPROVED">APPROVED</Option>
                    <Option value="REJECTED">REJECTED</Option>
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
                Danh sách Resumes
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

export default ResumePage;