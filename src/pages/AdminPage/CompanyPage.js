import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Tag, Select, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import debounce from 'lodash/debounce';
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import AddEditCompanyModal from './Modal/AddEditCompanyModal';
import CustomButton from '../../components/Other/CustomButton';

const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const CompanyPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState({
    name: '',
    address: '',
    email: '',
    isActive: ""
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const debouncedSearch = useCallback(
    debounce((searchParams) => {
      fetchCompanies({
        current: 1,
        pageSize: pagination.pageSize,
        ...searchParams
      });
    }, 500),
    []
  );

  const fetchCompanies = async (params = {}) => {
    setLoading(true);
    try {
      const searchParams = {
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      };

      if (params.name?.trim()) searchParams.name = params.name.trim();
      if (params.address?.trim()) searchParams.address = params.address.trim();
      if (params.isActive !== undefined && params.isActive !== '') {
        searchParams.isActive = params.isActive === 'true';
      }
      const response = await companyApi.getAll(searchParams);

      if (response?.data) {
        const { result, meta } = response.data;
        const dataWithKeys = result.map((item, index) => ({
          ...item,
          key: item._id,
          stt: index + 1 + ((meta.current - 1) * meta.pageSize)
        }));
        setData(dataWithKeys);
        setPagination({
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
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

  const handleSearchChange = (e, fieldName) => {
    const value = typeof e === 'object' && e.target ? e.target.value : e;
    const newSearchValues = {
      ...searchValues,
      [fieldName]: value
    };
    setSearchValues(newSearchValues);
    debouncedSearch(newSearchValues);
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
          fetchCompanies(pagination);
        } catch (error) {
          message.error('Không thể xóa công ty');
          console.error('Error:', error);
        }
      },
    });
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setModalMode('create');
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCompany(null);
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
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
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
    }
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchCompanies({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...searchValues
    });
  };

  const handleRefresh = () => {
    fetchCompanies({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    });
  };

  const onReset = () => {
    searchForm.resetFields();
    const defaultValues = {
      name: '',
      address: '',
      email: '',
      isActive: ''
    };
    setSearchValues(defaultValues);
    setTimeout(() => {
      fetchCompanies({
        current: 1,
        pageSize: pagination.pageSize,
        ...defaultValues
      });
    }, 0);
  };

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
          {/* Search Section */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <Form
              form={searchForm}
              onFinish={fetchCompanies}
              layout="vertical"
              className="ml-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item name="name" label="Tên Công Ty" className="col-span-1">
                  <Input
                    placeholder="Nhập tên công ty"
                    style={{ height: '40px' }}
                    onChange={(e) => handleSearchChange(e, 'name')}
                  />
                </Form.Item>

                <Form.Item name="address" label="Địa chỉ" className="col-span-1">
                  <Input
                    placeholder="Nhập địa chỉ"
                    style={{ height: '40px' }}
                    onChange={(e) => handleSearchChange(e, 'address')}
                  />
                </Form.Item>

                <Form.Item name="isActive" label="Trạng Thái" className="col-span-1">
                  <Select
                    placeholder="Chọn trạng thái"
                    allowClear
                    style={{ height: '40px' }}
                    onChange={(value) => handleSearchChange(value, 'isActive')}
                  >
                    <Option value="true">Hoạt động</Option>
                    <Option value="false">Không hoạt động</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  className="col-span-1"
                  label=" "
                >
                  <Button
                    onClick={onReset}
                    className="w-50"
                    style={{ height: '40px' }}
                    icon={<ReloadOutlined />}
                  >
                    Đặt lại
                  </Button>
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
                <CustomButton
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm mới
                </CustomButton>
                <Tooltip title="Làm mới">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    style={{ width: '44px', height: '44px' }}
                    className="flex items-center justify-center"
                  />

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

            <AddEditCompanyModal
              visible={isModalVisible}
              onClose={handleModalClose}
              refreshData={fetchCompanies}
              selectedCompany={selectedCompany}
              mode={modalMode}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyPage;