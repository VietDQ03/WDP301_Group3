import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Tag, message, } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import { roleApi } from "../../api/AdminPageAPI/roleAPI";
import { permissionApi } from "../../api/AdminPageAPI/permissionsAPI";

const { Content } = Layout;
const { Title } = Typography;

const RolePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loadingPermissions, setLoadingPermissions] = useState(new Set());

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });



  const fetchPermissionDetails = useCallback(async (id) => {
    if (permissions[id] || loadingPermissions.has(id)) return;

    setLoadingPermissions(prev => new Set([...prev, id]));

    try {
      const response = await permissionApi.getOne(id);
      if (response?.data) {
        setPermissions(prev => ({
          ...prev,
          [id]: response.data.name || 'N/A'
        }));
      }
    } catch (error) {
      console.error("Error fetching permission details:", error);
      setPermissions(prev => ({
        ...prev,
        [id]: 'N/A'
      }));
    } finally {
      setLoadingPermissions(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [permissions, loadingPermissions]);

  const fetchRoles = async (params = {}) => {
    setLoading(true);
    try {
      const response = await roleApi.getAll({
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...form.getFieldsValue()
      });

      const transformedData = response.data.result.map(role => ({
        ...role,
        key: role._id,
      }));

      setData(transformedData);
      setPagination({
        ...pagination,
        total: response.data.meta.total,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      });
    } catch (error) {
      message.error('Failed to fetch roles');
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRoles();
  }, []);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchRoles({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const onFinish = (values) => {
    fetchRoles({ current: 1, ...values });
  };

  const onReset = () => {
    form.resetFields();
    fetchRoles({ current: 1 });
  };

  const handleRefresh = () => {
    fetchRoles();
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record);
    // Implement edit functionality
  };

  const handleDelete = async (id) => {
    try {
      await roleApi.delete(id);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      message.error('Failed to delete role');
      console.error("Error deleting role:", error);
    }
  };

  const PermissionTag = ({ permissionId }) => {
    useEffect(() => {
      if (!permissions[permissionId] && !loadingPermissions.has(permissionId)) {
        fetchPermissionDetails(permissionId);
      }
    }, [permissionId, permissions, loadingPermissions, fetchPermissionDetails]);

    return (
      <Tag color="blue">
        {permissions[permissionId] || 'Loading...'}
      </Tag>
    );
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (text, record, index) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      }),
      align: 'center'
    },
    {
      title: "Tên Vai Trò",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      }),
      align: 'center'
    },
    {
      title: "Quyền Hạn",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissionIds) => (
        <div style={{ maxWidth: 1200, maxHeight: 100, overflow: 'auto' }}>
          {permissionIds?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {permissionIds.map((permissionId, index) => (
                <PermissionTag
                  key={`${permissionId}-${index}`}
                  permissionId={permissionId}
                />
              ))}
            </div>
          ) : (
            <span>No permissions</span>
          )}
        </div>
      )
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      width: 120,
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      }),
      align: 'center'
    },
    {
      title: "Hành Động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
      onHeaderCell: () => ({
        style: { textAlign: 'center' }
      }),
      align: 'center'
    }
  ];

  return (
    <Layout className="min-h-screen">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="name" label="Name" className="col-span-1">
                  <Input placeholder="Enter role name" style={{ height: '40px' }} />
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
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }} className="text-lg font-semibold">
                DANH SÁCH VAI TRÒ
              </Title>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm mới
                </Button>
                <Tooltip title="Refresh">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
                <Tooltip title="Settings">
                  <Button icon={<SettingOutlined />} />
                </Tooltip>
              </Space>
            </div>

            {/* Table */}
            <Table
              loading={loading}
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
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RolePage;