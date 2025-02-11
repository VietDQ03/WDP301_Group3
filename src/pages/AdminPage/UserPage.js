import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { roleApi } from "../../api/AdminPageAPI/roleAPI";
import EditUserModal from './Modal/EditUserModal';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Tag, Modal, Select, InputNumber } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const UserPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleMap, setRoleMap] = useState({});
  const [selectedRole, setSelectedRole] = useState(editingUser?.role || '');
  const [modalForm] = Form.useForm();

  const [rolePagination, setRolePagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchRoles = async (params = {}) => {
    setLoading(true);
    try {
      const response = await roleApi.getAll({
        current: params.current || rolePagination.current,
        pageSize: params.pageSize || rolePagination.pageSize,
        ...form.getFieldsValue()
      });

      const transformedData = response.data.result.map(role => ({
        ...role,
        key: role._id,
      }));

      // Tạo mapping object từ role._id sang role.name
      const roleMapping = {};
      transformedData.forEach(role => {
        roleMapping[role._id] = role.name;
      });

      setRoleMap(roleMapping);
      setRoles(transformedData);
      setRolePagination({
        ...rolePagination,
        total: response.data.meta.total,
        current: params.current || rolePagination.current,
        pageSize: params.pageSize || rolePagination.pageSize,
      });
    } catch (error) {
      message.error('Failed to fetch roles');
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await userApi.getAll({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        ...params,
      });

      if (response?.data) {
        const formattedUsers = response.data.result.map((user, index) => ({
          key: user._id,
          stt: index + 1 + ((response.data.meta.current - 1) * response.data.meta.pageSize),
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          address: user.address,
          role: user.role, // Giữ nguyên role ID
          roleName: roleMap[user.role] || 'N/A', // Thêm roleName từ mapping
          createdAt: new Date(user.createdAt).toLocaleString(),
          updatedAt: new Date(user.updatedAt).toLocaleString(),
        }));

        setUsers(formattedUsers);
        setPagination({
          current: response.data.meta.current,
          pageSize: response.data.meta.pageSize,
          total: response.data.meta.total,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await fetchRoles();
      fetchUsers({
        current: 1,
        pageSize: 10,
      });
    };
    initData();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await userApi.delete(id);
          message.success('Xóa người dùng thành công!');
          fetchUsers(pagination);
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error('Có lỗi xảy ra khi xóa người dùng!');
        }
      },
    });
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setEditModalVisible(true);
    modalForm.setFieldsValue({
      name: record.name,
      email: record.email,
      age: record.age,
      gender: record.gender,
      role: record.role,
      address: record.address,
    });
  };

  const handleUpdate = async (id, values) => {
    try {
      const requestData = {
        updateUserDto: {
          name: values.name.trim(),
          email: values.email.trim(),
          age: values.age,
          gender: values.gender,
          role: values.role,
          address: values.address,
          company: {
            _id: values.company?._id,
            name: values.company?.name
          }
        },
        user: {
          _id: id,
          name: values.name.trim(),
          email: values.email.trim()
        }
      };

      await userApi.update(id, requestData);
      fetchUsers(pagination);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      align: "center",
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "name",
      key: "name",
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
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "Giới Tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (gender) => (
        <Tag color={gender === 'MALE' ? 'blue' : 'pink'}>
          {gender === 'MALE' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (roleId) => (
        <Tag color="green">
          {roleMap[roleId] || 'N/A'}
        </Tag>
      ),
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
              onClick={() => handleEdit(record)}
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
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      ...newPagination,
      ...filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

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

  const handleModalSubmit = async (values) => {
    try {
      const company = selectedRole === '67566b60671f5436a0de69a5' ? {
        _id: values.company?._id,
        name: values.company?.name
      } : null;

      await handleUpdate(editingUser?.key, {
        ...values,
        company
      });
      message.success('Cập nhật thông tin thành công!');
      setEditModalVisible(false);
      setEditingUser(null);
      modalForm.resetFields();
      fetchUsers(pagination);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    modalForm.resetFields();
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
              layout="vertical"
              className="ml-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="name" label="Tên Người Dùng" className="col-span-1">
                  <Input placeholder="Nhập tên người dùng" style={{ height: '40px' }} />
                </Form.Item>

                <Form.Item name="email" label="Email" className="col-span-1">
                  <Input placeholder="Nhập email" style={{ height: '40px' }} />
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
                DANH SÁCH NGƯỜI DÙNG
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm mới
                </Button>
                <Tooltip title="Làm mới">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
                <Tooltip title="Cài đặt">
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
              }}
              onChange={handleTableChange}
              bordered
              size="middle"
              className="overflow-x-auto"
              loading={loading}
            />
          </div>
        </Content>

        <EditUserModal
          visible={editModalVisible}
          onCancel={handleModalCancel}
          onFinish={handleModalSubmit}
          editingUser={editingUser}
          roles={roles}
          loading={loading}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          form={modalForm}
        />
      </Layout>
    </Layout>
  );
};

export default UserPage;