import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../../components/AdminPage/Sidebar";
import Header from "../../components/AdminPage/Header";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { callUploadSingleFile } from "../../api/UserApi/UserApi";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, message, Modal, Tag, Select } from "antd";
import { PlusOutlined, ReloadOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Upload } from 'lucide-react';
import CreateCompanyModal from './Modal/CreateCompanyModal';

const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const CompanyPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchForm] = Form.useForm(); // Separate form for search
  const [editForm] = Form.useForm(); // Separate form for edit modal
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
  const [logo, setLogo] = useState("");

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleCreateCompany = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSubmit = async (values) => {
    try {
      await companyApi.create(values);
      message.success("Tạo công ty thành công!");
      setIsCreateModalVisible(false);
      fetchCompanies(); // Refresh danh sách công ty
    } catch (error) {
      message.error("Không thể tạo công ty, vui lòng thử lại!");
    }
  };

  const handleUploadFileLogo = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;

    try {
      const res = await callUploadSingleFile(file, "company");
      if (res.data && res.data.url) {
        setLogo(res.data.url);
        editForm.setFieldsValue({ logo: res.data.url }); // Update in the edit form
        message.success("Logo đã được tải lên thành công!");
      } else {
        message.error("Không thể tải logo lên, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải logo lên.");
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setLogo(company?.logo || "");
    setIsModalVisible(true);

    // Set values in editForm
    editForm.setFieldsValue({
      name: company.name,
      address: company.address,
      description: company.description,
      isActive: company.isActive,
      logo: company.logo,
      createdBy: company.createdBy.email || "Admin"
    });
  };

  useEffect(() => {
    if (selectedCompany) {
      setLogo(selectedCompany.logo || "");
    }
  }, [selectedCompany]);

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
        searchParams.isActive = params.isActive === 'true'; // Convert string to boolean
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
    const value = typeof e === 'object' && e.target ? e.target.value : e; // Xử lý Select
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

  const onFinish = (values) => {
    setSearchValues(values);
    fetchCompanies({
      current: 1,
      pageSize: pagination.pageSize,
      ...values
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

  const handleRefresh = () => {
    fetchCompanies({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCompany(null);
    setLogo("");
    editForm.resetFields(); // Reset edit form fields when modal closes
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
              form={searchForm} // Use searchForm for search
              onFinish={onFinish}
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
                    onChange={(value) => handleSearchChange({ target: { value } }, 'isActive')}
                  >
                    <Option value="true">Hoạt động</Option>
                    <Option value="false">Không hoạt động</Option>
                  </Select>
                </Form.Item>

                <Form.Item className="col-span-1" style={{ marginBottom: 0, marginTop: '35px' }}>
                  <div className="flex space-x-2">
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
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCompany}>
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
            <CreateCompanyModal
              visible={isCreateModalVisible}
              onClose={handleCancelCreate}
              refreshData={fetchCompanies} // Hàm để cập nhật danh sách công ty sau khi tạo
            />
            <Modal
              title="Chỉnh sửa công ty"
              open={isModalVisible}
              onCancel={handleModalClose}
              footer={null}
              width={580}
              centered
              bodyStyle={{ padding: '16px 24px' }}
            >
              <Form
                form={editForm}
                layout="vertical"
                onFinish={async (values) => {
                  const payload = { ...values, logo };
                  try {
                    await companyApi.update(selectedCompany._id, payload);
                    message.success("Cập nhật công ty thành công");
                    handleModalClose();
                    fetchCompanies();
                  } catch (error) {
                    message.error("Không thể cập nhật công ty");
                  }
                }}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {/* Left column */}
                  <Form.Item
                    name="name"
                    label="Tên Công Ty"
                    rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
                    className="mb-2"
                  >
                    <Input />
                  </Form.Item>

                  {/* Right column */}
                  <Form.Item
                    name="address"
                    label="Địa Chỉ"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ công ty" }]}
                    className="mb-2"
                  >
                    <Input />
                  </Form.Item>

                  {/* Left column */}
                  <Form.Item
                    name="createdBy"
                    label="Người tạo"
                    className="mb-2"
                  >
                    <Input disabled />
                  </Form.Item>

                  {/* Right column */}
                  <Form.Item
                    name="isActive"
                    label="Trạng thái"
                    className="mb-2"
                  >
                    <Select>
                      <Select.Option value={true}>Hoạt động</Select.Option>
                      <Select.Option value={false}>Không hoạt động</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                {/* Full width for description with ReactQuill */}
                <Form.Item
                  name="description"
                  label="Mô tả công ty"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả công ty!" }]}
                  className="mb-2"
                >
                  <ReactQuill
                    theme="snow"
                    style={{ height: '120px' }}
                    placeholder="Nhập mô tả công ty..."
                  />
                </Form.Item>

                {/* Logo upload */}
                <div className="mt-20 mb-2">
                  <div className="flex items-center mb-1">
                    <span>Logo công ty</span>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{logo ? "Cập nhật logo" : "Tải Logo"}</span>
                      <input
                        type="file"
                        onChange={handleUploadFileLogo}
                        accept="image/*"
                        className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                      />
                    </label>
                    {logo && (
                      <div className="text-xs text-green-600 truncate max-w-xs">
                        {logo.length > 28 ? `${logo.substring(0, 28)}...` : logo}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button onClick={handleModalClose}>Hủy</Button>
                  <Button type="primary" htmlType="submit">Cập nhật</Button>
                </div>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyPage;