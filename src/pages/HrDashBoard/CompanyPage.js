import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/HrDashBoard/Sidebar";
import Header from "../../components/HrDashBoard/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Modal } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

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
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => console.log('Edit company:', record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
    setSearchValues(values);
    fetchCompanies({
      ...values,
      current: 1,
      pageSize: pagination.pageSize
    });
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

  return (
    <Layout className="min-h-screen flex flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          {/* Search Section */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="ml-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="name" label="Tên Công Ty" className="col-span-1">
                  <Input placeholder="Nhập tên công ty" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item name="address" label="Địa chỉ" className="col-span-1">
                  <Input placeholder="Nhập địa chỉ" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item className="col-span-1" style={{ marginBottom: 0, marginTop: '35px' }}>
                  <div className="flex space-x-2">
                    <Button type="primary" htmlType="submit">
                      Tìm kiếm
                    </Button>
                    <Button onClick={onReset}>Đặt lại</Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>

          {/* List Section */}
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                DANH SÁCH CÔNG TY
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm mới
                </Button>
                <Tooltip title="Làm mới">
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleRefresh}
                  />
                </Tooltip>
                <Tooltip title="Cài đặt">
                  <Button icon={<SettingOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <Table
              dataSource={data}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
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

export default CompanyPage;