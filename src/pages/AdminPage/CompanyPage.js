import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Modal, } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";

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

  const fetchCompanies = async (params = {}) => {
    setLoading(true);
    try {
      const response = await companyApi.getAll({
        page: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...params
      });

      if (response?.data?.data) {
        const { result, meta } = response.data.data;

        const dataWithKeys = result.map((item, index) => ({
          ...item,
          key: item._id,
          stt: index + 1 + ((meta.current - 1) * meta.pageSize)
        }));

        setData(dataWithKeys);
        setPagination({
          current: meta.current || params.current || pagination.current,
          pageSize: meta.pageSize || params.pageSize || pagination.pageSize,
          total: meta.total || 0,
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

  const handleSearch = async (values) => {
    setSearchValues(values);
    fetchCompanies({
      ...values,
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa công ty này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await companyApi.delete(id);
          message.success('Xóa công ty thành công');
          fetchCompanies({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...searchValues
          });
        } catch (error) {
          message.error('Không thể xóa công ty');
          console.error('Error:', error);
        }
      },
    });
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchCompanies({
      ...newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
      ...searchValues
    });
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

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, record) => record.stt
    },
    {
      title: "Tên Công Ty",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      })
    },
    {
      title: "Email",
      dataIndex: ["createdBy", "email"],
      key: "email",
      align: "center",
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
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
          <Tooltip title="Xóa">
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
          <div className="bg-white p-8 shadow rounded-lg min-h-[800px]">
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
                  />
                </Form.Item>

                <Form.Item name="address" label="Địa chỉ">
                  <Input
                    placeholder="Nhập địa chỉ"
                    style={{ height: "40px" }}
                  />
                </Form.Item>

                <Form.Item name="email" label="Email">
                  <Input
                    placeholder="Nhập email"
                    style={{ height: "40px" }}
                  />
                </Form.Item>

                <Form.Item>
                  <div className="flex space-x-2" style={{ marginTop: "35px" }}>
                    <Button type="primary" htmlType="submit">
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
                <Tooltip title="Làm mới">
                  <Button
                    icon={<ReloadOutlined />}
                    shape="round"
                    size="middle"
                    onClick={handleRefresh}
                    loading={loading}
                  />
                </Tooltip>
                <Tooltip title="Cài đặt">
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
                showSizeChanger: true,
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