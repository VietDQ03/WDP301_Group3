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



const { Option } = Select;
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [logo, setLogo] = useState(selectedCompany?.logo || "");

  const handleUploadFileLogo = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;

    try {
      const res = await callUploadSingleFile(file, "company");
      if (res.data && res.data.url) {
        setLogo(res.data.url);
        form.setFieldsValue({ logo: res.data.url }); // Cập nhật vào form
        message.success("Logo đã được tải lên thành công!");
      } else {
        message.error("Không thể tải logo lên, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải logo lên.");
    }
  };

  const navigate = useNavigate();

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setLogo(company?.logo || "");
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (selectedCompany) {
      setLogo(selectedCompany.logo || "");
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedCompany) {
      form.setFieldsValue({ ...selectedCompany, logo });
    }
  }, [selectedCompany, logo, form]);

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
    const value = e.target.value;
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

  const handleCreateCompany = () => {
    navigate('/create-company');
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
            <Modal
              title="Chỉnh sửa công ty"
              open={isModalVisible}
              onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
              footer={null}
              centered // Đặt modal luôn giữa màn hình
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  name: selectedCompany?.name,
                  address: selectedCompany?.address,
                  description: selectedCompany?.description,
                  isActive: selectedCompany?.isActive,
                  logo: selectedCompany?.logo
                }}
                onFinish={async (values) => {
                  const payload = { ...values, logo };
                  try {
                    await companyApi.update(selectedCompany._id, payload);
                    message.success("Cập nhật công ty thành công");
                    setIsModalVisible(false);
                    fetchCompanies(); // Refresh danh sách công ty
                  } catch (error) {
                    message.error("Không thể cập nhật công ty");
                  }
                }}
              >
                <Form.Item name="name" label="Tên Công Ty" rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}>
                  <Input />
                </Form.Item>

                <Form.Item name="address" label="Địa Chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ công ty" }]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả công ty"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả công ty!" }]}
                >
                  <ReactQuill theme="snow" className="h-36" placeholder="Nhập mô tả công ty..." />
                </Form.Item>

                <Form.Item name="isActive" label="Trạng thái" className="mt-14">
                  <Select>
                    <Select.Option value={true}>Hoạt động</Select.Option>
                    <Select.Option value={false}>Không hoạt động</Select.Option>
                  </Select>
                </Form.Item>

                <div className="space-y-2 mb-4">
                  <label className="block">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5" />
                      <span className="ml-2">Logo công ty</span>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 w-60 justify-center">
                      <Upload className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{logo ? "Cập nhật logo" : "Tải Logo"}</span>
                      <input
                        type="file"
                        onChange={handleUploadFileLogo}
                        accept="image/*"
                        className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                      />
                    </label>
                    {logo && <span className="text-green-600 truncate inline-block" >{logo}</span>}
                  </div>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyPage;