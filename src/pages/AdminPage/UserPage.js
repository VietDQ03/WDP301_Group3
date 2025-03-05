import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { roleApi } from "../../api/AdminPageAPI/roleAPI";
import EditUserModal from './Modal/EditUserModal';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Tag, Modal, Select } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  EditOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import './UserPage.css';

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

  useEffect(() => {
    if (editModalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [editModalVisible]);

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
        const formattedUsers = response.data.result
          .filter(user => !user.isDeleted)
          .map((user, index) => {
            const userRole = roles.find(role => role._id === user.role);

            return {
              key: user._id,
              stt: index + 1 + ((response.data.meta.current - 1) * response.data.meta.pageSize),
              name: user.name,
              email: user.email,
              age: user.age,
              gender: user.gender,
              address: user.address,
              role: user.role,
              roleName: userRole ? userRole.name : 'N/A',
              isActived: user.isActived,
              premium: user.premium || 0,
              createdAt: new Date(user.createdAt).toLocaleString(),
              updatedAt: new Date(user.updatedAt).toLocaleString(),
              // Thêm thông tin company vào đây
              company: user.company ? {
                _id: user.company._id,
                name: user.company.name
              } : null
            };
          });

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
      setLoading(true);
      try {
        const [rolesResponse, usersResponse] = await Promise.all([
          roleApi.getAll({
            current: rolePagination.current,
            pageSize: rolePagination.pageSize,
            ...form.getFieldsValue()
          }),
          userApi.getAll({
            current: 1,
            pageSize: 10,
          })
        ]);

        const transformedRoles = rolesResponse.data.result.map(role => ({
          ...role,
          key: role._id,
        }));

        const roleMapping = {};
        transformedRoles.forEach(role => {
          roleMapping[role._id] = role.name;
        });

        setRoleMap(roleMapping);
        setRoles(transformedRoles);
        setRolePagination({
          ...rolePagination,
          total: rolesResponse.data.meta.total,
        });

        if (usersResponse?.data) {
          const formattedUsers = usersResponse.data.result
            .filter(user => !user.isDeleted)
            .map((user, index) => {
              const userRole = transformedRoles.find(role => role._id === user.role);

              return {
                key: user._id,
                stt: index + 1 + ((usersResponse.data.meta.current - 1) * usersResponse.data.meta.pageSize),
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                address: user.address,
                role: user.role,
                roleName: userRole ? userRole.name : 'N/A',
                isActived: user.isActived,
                premium: user.premium || 0,
                createdAt: new Date(user.createdAt).toLocaleString(),
                updatedAt: new Date(user.updatedAt).toLocaleString(),
                company: user.company ? {
                  _id: user.company._id,
                  name: user.company.name
                } : null
              };
            });

          setUsers(formattedUsers);
          setPagination({
            current: usersResponse.data.meta.current,
            pageSize: usersResponse.data.meta.pageSize,
            total: usersResponse.data.meta.total,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleBan = (userId) => {
    confirm({
      title: 'Xác nhận thay đổi trạng thái người dùng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thay đổi trạng thái của người dùng này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          message.success('Thay đổi trạng thái người dùng thành công!');
          fetchUsers(pagination);
        } catch (error) {
          console.error("Error toggling user status:", error);
          message.error('Có lỗi xảy ra khi thay đổi trạng thái người dùng!');
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

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return 'red';
      case 'ADMIN':
        return 'blue';
      case 'NORMAL_USER':
        return 'green';
      default:
        return 'default';
    }
  };

  // Handle real-time search
  const handleSearch = (changedValues, allValues) => {
    fetchUsers({
      ...pagination,
      current: 1,
      ...allValues,
    });
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
        <Tag color={gender === 'Male' ? 'blue' : 'pink'}>
          {gender === 'Male' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
    },
    {
      title: "Số lượt đăng bài",
      dataIndex: "premium",
      key: "premium",
      align: "center",
      render: (premium) => {
        if (!premium) return <Tag color="default">Không</Tag>;
        return (
          <Tag color={premium === 1 ? "gold" : "purple"}>
            {premium} lượt
          </Tag>
        );
      },
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      align: "center",
      render: (roleName) => (
        <Tag color={getRoleColor(roleName)}>
          {roleName || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActived",
      key: "isActived",
      align: "center",
      render: (isActived) => (
        <Tag color={isActived ? 'success' : 'error'}>
          {isActived ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
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
          <Tooltip title={record.isActived ? "Khóa" : "Mở khóa"}>
            <Button
              type="text"
              icon={<StopOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleBan(record.key)}
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

  const handleModalSubmit = async (updateData) => {
    try {
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== '')
      );

      if (Object.keys(filteredUpdateData).length === 0) {
        message.error("Không có dữ liệu nào được thay đổi!");
        return;
      }

      await userApi.update(editingUser?.key, filteredUpdateData);

      message.success("Cập nhật thông tin thành công!");
      setEditModalVisible(false);
      setEditingUser(null);
      fetchUsers(pagination);
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    modalForm.resetFields();
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="m-6">
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              layout="vertical"
              className="ml-4"
              onValuesChange={handleSearch}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Form.Item name="name" label="Tên Người Dùng" className="col-span-1">
                  <Input
                    placeholder="Nhập tên người dùng"
                    style={{ height: '40px' }}
                    allowClear
                  />
                </Form.Item>

                <Form.Item name="email" label="Email" className="col-span-1">
                  <Input
                    placeholder="Nhập email"
                    style={{ height: '40px' }}
                    allowClear
                  />
                </Form.Item>

                <Form.Item name="role" label="Vai trò" className="col-span-1">
                  <Select
                    placeholder="Chọn vai trò"
                    style={{ width: '100%', height: '40px' }}
                    allowClear
                  >
                    {roles.map(role => (
                      <Select.Option key={role._id} value={role._id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="isActived" label="Trạng thái" className="col-span-1">
                  <Select
                    placeholder="Chọn trạng thái"
                    style={{ width: '100%', height: '40px' }}
                    allowClear
                  >
                    <Select.Option value={true}>Hoạt động</Select.Option>
                    <Select.Option value={false}>Không hoạt động</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label=" " className="col-span-1">
                  <Button
                    onClick={onReset}
                    style={{ height: '40px' }}
                  >
                    Đặt lại
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                DANH SÁCH NGƯỜI DÙNG
              </Title>
              <Space>
                <Tooltip title="Làm mới">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
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