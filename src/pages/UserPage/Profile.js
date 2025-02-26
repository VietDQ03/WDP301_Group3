import React, { useEffect, useState } from "react";
import {
    Card,
    Avatar,
    Descriptions,
    Divider,
    Button,
    Typography,
    Input,
    message
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    BankOutlined,
    IdcardOutlined,
    EditOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../config/axiosCustom";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import CustomButton from "../../components/Other/CustomButton";

const { Title } = Typography;

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        address: "",
    });

    const [companyName, setCompanyName] = useState("Chưa cập nhật");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                age: user.age || "",
                gender: user.gender ? "Nam" : "Nữ",
                address: user.address || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (user?.company?._id) {
            axios
                .get(`/companies/${user.company._id}`)
                .then((response) => {
                    setCompanyName(response.data.name || "Chưa cập nhật");
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy thông tin công ty:", error);
                    setCompanyName("Chưa cập nhật");
                });
        }
    }, [user?.company?._id]);

    // Xử lý khi nhập liệu
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = () => {
        navigate("/change-password")
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await axios.patch(`/users/${user._id}`, formData);
            
            dispatch({
                type: "UPDATE_USER",
                payload: response.data,
            });

            message.success("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            message.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8" style={{ minHeight: "61vh" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-4xl mx-auto shadow-lg rounded-lg" bordered={false}>
                        {/* Profile Header */}
                        <div className="flex items-center space-x-6 mb-8">
                            <Avatar size={96} icon={<UserOutlined />} className="bg-blue-500" />
                            <div>
                                <Title level={2} className="mb-2">{formData.name || "Người dùng"}</Title>
                            </div>
                        </div>

                        <Divider />

                        {/* Profile Information */}
                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                        >
                            <Descriptions.Item label={<span><MailOutlined className="mr-2" />Email</span>}>
                                {user?.email || "Chưa cập nhật"}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span><IdcardOutlined className="mr-2" />Tuổi</span>}>
                                <Input
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Nhập tuổi"
                                />
                            </Descriptions.Item>

                            <Descriptions.Item label={<span><UserOutlined className="mr-2" />Giới tính</span>}>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span><HomeOutlined className="mr-2" />Địa chỉ</span>} span={2}>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Descriptions.Item>

                            {user?.role?.name === "HR_ROLE" && (
                                <Descriptions.Item label={<span><BankOutlined className="mr-2" />Công ty</span>}>
                                    {companyName || "Chưa cập nhật"}
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-8 space-x-4">
                            <Button style={{ height: "2.75rem" }} type="default" onClick={handleChangePassword}>
                                Đổi mật khẩu
                            </Button>
                            <CustomButton
                                htmlType="button"
                                icon={<EditOutlined />}
                                onClick={handleUpdate}
                                loading={loading}
                            >
                                Cập nhật
                            </CustomButton>
                        </div>
                    </Card>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default UserProfile;