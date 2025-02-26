import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Form,
    message
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../config/axiosCustom";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import CustomButton from "../../components/Other/CustomButton";

const { Title } = Typography;

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("/auth/change-password", values);
            message.success("Đổi mật khẩu thành công!");
            navigate("/profile");
        } catch (error) {
            message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
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
                    <Card className="max-w-lg mx-auto shadow-lg rounded-lg p-6" bordered={false}>
                        <Title level={2} className="text-center mb-4">Đổi mật khẩu</Title>
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                label="Mật khẩu cũ"
                                name="oldPassword"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu cũ" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                dependencies={["newPassword"]}
                                rules={[
                                    { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("newPassword") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Mật khẩu xác nhận không khớp!");
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                            </Form.Item>

                            <div className="flex justify-end mt-4">
                                <CustomButton htmlType="submit" loading={loading}>
                                    Cập nhật
                                </CustomButton>
                            </div>
                        </Form>
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ChangePassword;
