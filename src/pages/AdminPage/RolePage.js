import React, { useCallback, useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { Table, Input, Space, Form, Typography, Tooltip, Layout, Tag, message, Select, Button, Modal } from "antd";
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { roleApi } from "../../api/AdminPageAPI/roleAPI";
import { permissionApi } from "../../api/AdminPageAPI/permissionsAPI";
import AddEditRoleModal from "./Modal/AddEditRoleModal";
import CustomButton from "../../components/Other/CustomButton";
import debounce from 'lodash/debounce';

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const RolePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loadingAllPermissions, setLoadingAllPermissions] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState(undefined);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((searchText, searchStatus) => {
        fetchRoles({
          current: 1,
          name: searchText,
          isActive: searchStatus
        });
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const loadAllPermissions = useCallback(async (rolesData) => {
    if (!rolesData?.length) {
      setLoadingAllPermissions(false);
      return;
    }

    const allPermissionIds = new Set(
      rolesData.flatMap(role => role.permissions || [])
    );

    const unloadedIds = Array.from(allPermissionIds)
      .filter(id => !permissions[id]);

    if (!unloadedIds.length) {
      setLoadingAllPermissions(false);
      return;
    }

    try {
      const responses = await Promise.all(
        unloadedIds.map(id => permissionApi.getOne(id))
      );

      const newPermissions = {};
      responses.forEach((response, index) => {
        const id = unloadedIds[index];
        newPermissions[id] = response?.data?.name || `Permission ${id}`;
      });

      setPermissions(prev => ({
        ...prev,
        ...newPermissions
      }));
    } catch (error) {
      console.error("Error loading all permissions:", error);
      const failedPermissions = unloadedIds.reduce((acc, id) => ({
        ...acc,
        [id]: `Permission ${id}`
      }), {});

      setPermissions(prev => ({
        ...prev,
        ...failedPermissions
      }));
    } finally {
      setLoadingAllPermissions(false);
    }
  }, [permissions]);

  const fetchRoles = async (params = {}) => {
    setLoading(true);
    setLoadingAllPermissions(true);
    try {
      const response = await roleApi.getAll({
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        name: params.name || searchText,
        isActive: params.isActive !== undefined ? params.isActive : searchStatus,
        ...params
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

      await loadAllPermissions(transformedData);
    } catch (error) {
      message.error('Không thể tải danh sách vai trò');
      console.error("Error fetching roles:", error);
      setLoadingAllPermissions(false);
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value, searchStatus);
  };

  const handleStatusChange = (value) => {
    setSearchStatus(value);
    debouncedSearch(searchText, value);
  };

  const handleReset = () => {
    setSearchText('');
    setSearchStatus(undefined);
    form.resetFields();
    fetchRoles({ current: 1 });
  };

  const handleRefresh = () => {
    fetchRoles();
  };

  const handleAddNew = () => {
    setEditingRole(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRole(record);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingRole(null);
  };

  const handleModalSuccess = () => {
    fetchRoles();
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa vai trò này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await roleApi.delete(id);
          message.success('Xóa vai trò thành công!');
          fetchRoles({
            current: pagination.current,
            pageSize: pagination.pageSize
          });
        } catch (error) {
          console.error("Error deleting role:", error);
          message.error('Có lỗi xảy ra khi xóa vai trò!');
        }
      },
    });
  };

  const PermissionTag = useMemo(() => {
    return React.memo(({ permissionId }) => {
      const permissionName = permissions[permissionId];

      return (
        <Tag color={permissionName ? 'blue' : 'gray'}>
          {permissionName || `Permission ${permissionId}`}
        </Tag>
      );
    });
  }, [permissions]);

  const columns = useMemo(() => [
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
            <span>Chưa có quyền hạn</span>
          )}
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 120,
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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
  ], [PermissionTag, pagination.current, pagination.pageSize]);

  return (
    <Layout className="min-h-screen">
      <div
        className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-[255px]'
          } flex-shrink-0`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-6">
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={form}
              layout="vertical"
              className="ml-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="Tên vai trò" className="col-span-1">
                  <Input
                    placeholder="Nhập tên vai trò"
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ height: '40px' }}
                  />
                </Form.Item>

                <Form.Item label="Trạng thái" className="col-span-1">
                  <Select
                    placeholder="Chọn trạng thái"
                    allowClear
                    style={{ width: '100%', height: '40px', }}
                    value={searchStatus}
                    onChange={handleStatusChange}
                    options={[
                      { value: true, label: 'Đang hoạt động' },
                      { value: false, label: 'Ngừng hoạt động' }
                    ]}
                  />
                </Form.Item>

                <Form.Item className="col-span-1" style={{ marginBottom: 0, marginTop: '29px' }}>
                  <Button
                    onClick={handleReset}
                    size="large"
                    style={{ height: '40px', padding: '6.5px 16px' }}
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
                DANH SÁCH VAI TRÒ
              </Title>
              <Space>
                <CustomButton
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                >
                  Thêm mới
                </CustomButton>
                <Tooltip title="Làm mới">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    size="large"
                    style={{
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </Tooltip>
              </Space>
            </div>

            <Table
              loading={loading || loadingAllPermissions}
              dataSource={loadingAllPermissions ? [] : data}
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

      <AddEditRoleModal
        open={modalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        editData={editingRole}
      />
    </Layout>
  );
};

export default RolePage;