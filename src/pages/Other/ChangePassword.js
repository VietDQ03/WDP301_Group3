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

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject();
        }
        if (value.length < 6) {
            return Promise.reject("Mật khẩu phải có ít nhất 6 ký tự!");
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject("Mật khẩu phải có ít nhất 1 chữ cái in hoa!");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return Promise.reject("Mật khẩu phải có ít nhất 1 ký tự đặc biệt!");
        }
        return Promise.resolve();
    };

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
                                <Input.Password 
                                    prefix={<LockOutlined />} 
                                    placeholder="Nhập mật khẩu cũ"
                                    size="large"  
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                    { validator: validatePassword }
                                ]}
                            >
                                <Input.Password  
                                    prefix={<LockOutlined />} 
                                    placeholder="Nhập mật khẩu mới"
                                    size="large"
                                />
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
                                <Input.Password 
                                    prefix={<LockOutlined />} 
                                    placeholder="Xác nhận mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <div className="flex justify-end mt-4 ">
                                <CustomButton htmlType="submit" className={"w-full"} loading={loading}>
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