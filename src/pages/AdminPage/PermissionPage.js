import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { permissionApi } from "../../api/AdminPageAPI/permissionsAPI";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const PermissionPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchPermissions = async (params = {}) => {
    try {
      setLoading(true);
      const response = await permissionApi.getAll({
        ...params,
        page: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      });

      const { result, meta } = response.data;

      const formattedPermissions = result.map((permission, index) => ({
        key: permission._id,
        stt: index + 1 + ((meta.current - 1) * meta.pageSize),
        ...permission
      }));

      setPermissions(formattedPermissions);
      setPagination({
        current: meta.current || 1,
        pageSize: meta.pageSize || 10,
        total: meta.total || 0
      });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      message.error("Có lỗi xảy ra khi tải danh sách quyền!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa quyền này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await permissionApi.delete(id);
          message.success('Xóa quyền thành công!');
          fetchPermissions({
            current: pagination.current,
            pageSize: pagination.pageSize
          });
        } catch (error) {
          console.error("Error deleting permission:", error);
          message.error('Có lỗi xảy ra khi xóa quyền!');
        }
      },
    });
  };

  const methodColors = {
    GET: 'blue',
    POST: 'green',
    PATCH: 'orange',
    DELETE: 'red'
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      align: "center",
      className: "text-center",
    },
    {
      title: "Tên Quyền",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "API Path",
      dataIndex: "apiPath",
      key: "apiPath",
      align: "center"
    },
    {
      title: "Phương Thức",
      dataIndex: "method",
      key: "method",
      align: "center",
      render: (method) => (
        <Tag color={methodColors[method] || 'default'}>
          {method}
        </Tag>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      align: "center"
    },
    {
      title: "Hành Động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => {
                setEditingPermission(record);
                editForm.setFieldsValue({
                  name: record.name,
                  apiPath: record.apiPath,
                  method: record.method,
                  module: record.module
                });
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    console.log("Table Change:", { newPagination, filters, sorter });
    fetchPermissions({
      ...newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const onFinish = (values) => {
    console.log("Search Values:", values);
    fetchPermissions({
      ...values,
      current: 1
    });
  };

  const onReset = () => {
    form.resetFields();
    fetchPermissions({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingPermission) {
        await permissionApi.update(editingPermission.key, values);
        message.success('Cập nhật quyền thành công!');
      } else {
        await permissionApi.create(values);
        message.success('Thêm quyền mới thành công!');
      }
      setIsModalVisible(false);
      setEditingPermission(null);
      editForm.resetFields();
      fetchPermissions({
        current: pagination.current,
        pageSize: pagination.pageSize
      });
    } catch (error) {
      console.error("Modal Error:", error);
      message.error('Có lỗi xảy ra khi lưu quyền!');
    }
  };

  const handleRefresh = () => {
    fetchPermissions({
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Content className="m-6">
          {/* Search Section */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              onFinish={onFinish}
              className="ml-4"
              layout="vertical"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="name" label="Tên Quyền" className="col-span-1">
                  <Input placeholder="Nhập tên quyền" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item name="method" label="Phương Thức" className="col-span-1">
                  <Select placeholder="Chọn phương thức" style={{ height: '40px' }}>
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PATCH">PATCH</Option>
                    <Option value="DELETE">DELETE</Option>
                  </Select>
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
                DANH SÁCH QUYỀN
              </Title>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingPermission(null);
                    setIsModalVisible(true);
                  }}
                >
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
              loading={loading}
              dataSource={permissions}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
              bordered
              size="middle"
              className="overflow-x-auto"
            />
          </div>

          {/* Modal Add/Edit */}
          <Modal
            title={editingPermission ? "Sửa Quyền" : "Thêm Quyền Mới"}
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingPermission(null);
              editForm.resetFields();
            }}
            width={800}
          >
            <Form
              form={editForm}
              layout="vertical"
            >
              <Form.Item
                name="name"
                label="Tên Quyền"
                rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
              >
                <Input placeholder="Nhập tên quyền" />
              </Form.Item>

              <Form.Item
                name="apiPath"
                label="API Path"
                rules={[{ required: true, message: 'Vui lòng nhập API path!' }]}
              >
                <Input placeholder="Nhập API path" />
              </Form.Item>

              <Form.Item
                name="method"
                label="Phương Thức"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
              >
                <Select placeholder="Chọn phương thức">
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PATCH">PATCH</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="module"
                label="Module"
                rules={[{ required: true, message: 'Vui lòng nhập tên module!' }]}
              >
                <Input placeholder="Nhập tên module" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PermissionPage;