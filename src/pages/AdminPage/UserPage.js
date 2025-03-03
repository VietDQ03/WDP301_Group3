import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { userApi } from "../../api/AdminPageAPI/userAPI";
import { roleApi } from "../../api/AdminPageAPI/roleAPI";
import EditUserModal from './Modal/EditUserModal';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Tag, Modal } from "antd";
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
          .map((user, index) => ({
            key: user._id,
            stt: index + 1 + ((response.data.meta.current - 1) * response.data.meta.pageSize),
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            address: user.address,
            role: user.role,
            roleName: roleMap[user.role] || 'N/A',
            isActived: user.isActived,
            premium: user.premium || 0,
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
          // Implement your toggle status API call here
          // await userApi.toggleStatus(userId);
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
        <Tag color="blue">{roleName || 'N/A'}</Tag>
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
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="m-6">
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