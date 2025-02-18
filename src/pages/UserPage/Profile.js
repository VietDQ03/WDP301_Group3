import React from 'react';
import { Card, Avatar, Descriptions, Tag, Divider, Button, Typography } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    BankOutlined,
    IdcardOutlined,
    EditOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import CustomButton from "../../components/Other/CustomButton"

const { Title } = Typography;

const UserProfile = () => {
    const userInfo = {
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        age: 30,
        gender: "Nam",
        address: "123 Đường ABC, Quận XYZ, TP.HCM",
        role: "Senior Developer",
        company: "Tech Company Ltd"
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        className="max-w-4xl mx-auto shadow-lg rounded-lg"
                        bordered={false}
                    >
                        {/* Profile Header */}
                        <div className="flex items-center space-x-6 mb-8">
                            <Avatar
                                size={96}
                                icon={<UserOutlined />}
                                className="bg-blue-500"
                            />
                            <div>
                                <Title level={2} className="mb-2">{userInfo.name}</Title>
                                <Tag color="blue">{userInfo.role}</Tag>
                            </div>
                        </div>

                        <Divider />

                        {/* Profile Information */}
                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                        >
                            <Descriptions.Item
                                label={<span><MailOutlined className="mr-2" />Email</span>}
                            >
                                {userInfo.email}
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={<span><IdcardOutlined className="mr-2" />Tuổi</span>}
                            >
                                {userInfo.age}
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={<span><UserOutlined className="mr-2" />Giới tính</span>}
                            >
                                {userInfo.gender}
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={<span><HomeOutlined className="mr-2" />Địa chỉ</span>}
                                span={2}
                            >
                                {userInfo.address}
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={<span><BankOutlined className="mr-2" />Công ty</span>}
                            >
                                {userInfo.company}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-8 space-x-4">
                            <Button style={{ height: '2.75rem' }} type="default">
                                Đổi mật khẩu
                            </Button>
                            <CustomButton
                                htmlType="button"
                                icon={<EditOutlined />}
                            >
                                Chỉnh sửa thông tin
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