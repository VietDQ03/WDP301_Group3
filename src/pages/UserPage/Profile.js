import React, { useEffect, useState } from "react";
import { Card, Avatar, Input, notification } from "antd";
import {
    UserOutlined,
    EditOutlined,
    LockOutlined,
    SaveOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../config/axiosCustom";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import { updateUser } from "../../redux/slices/auth";

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        age: user?.age || "",
        gender: user?.gender || "",
        address: user?.address || "",
    });
    const displayGender = (gender) => {
        const genderMap = {
            'Male': 'Nam',
            'Female': 'Nữ',
            'Other': 'Khác'
        };
        return genderMap[gender] || "Chưa cập nhật";
    };
    const [companyName, setCompanyName] = useState(
        user?.company?.name || "Chưa cập nhật"
    );
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


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
                gender: user.gender || "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Thêm validation cho age
        if (name === 'age') {
            // Chỉ cho phép số không âm hoặc rỗng
            if (value === '' || (parseInt(value) >= 0 && !value.includes('.'))) {
                setFormData({ ...formData, [name]: value });
            }
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                age: formData.age === '' ? null : Number(formData.age)
            };
    
            const response = await axios.patch(`/users/${user._id}`, dataToSubmit);
    
            // Dispatch action để update user trong redux store
            dispatch(updateUser(response.data));
    
            setFormData({
                name: response.data.name || "",
                age: response.data.age || "",
                gender: response.data.gender || "",
                address: response.data.address || "",
            });
    
            notification.success({
                message: 'Thành công',
                description: 'Cập nhật thông tin thành công!',
                placement: 'bottomRight',
                duration: 3,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            notification.error({
                message: 'Thất bại',
                description: 'Cập nhật thông tin thất bại!',
                placement: 'bottomRight',
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                age: user.age || "",
                gender: user.gender ? "Nam" : "Nữ",
                address: user.address || "",
            });
        }
        setIsEditing(false);
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <Card className="shadow-lg rounded-xl">
                        <div className="flex">
                            {/* Left Column - Basic Info */}
                            <div className="w-1/3 border-r pr-6">
                                <div className="flex flex-col items-center mb-8">
                                    <Avatar
                                        size={120}
                                        icon={<UserOutlined />}
                                        className="border-4 border-white shadow-lg bg-blue-500 text-white mb-4"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                                        {isEditing ? (
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold">
                                                {formData.name || "Chưa cập nhật"}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="text-lg font-semibold">
                                            {user?.email || "Chưa cập nhật"}
                                        </p>
                                    </div>
                                    {user?.role?.name === "HR_ROLE" && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Công ty</p>
                                            <p className="text-lg font-semibold">{companyName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Additional Info */}
                            <div className="w-2/3 pl-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                                    {isEditing ? (
                                        <div className="space-x-4">
                                            <button
                                                onClick={handleCancel}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                <CloseOutlined className="mr-2" />
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleUpdate}
                                                disabled={loading}
                                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center">
                                                        <svg
                                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Đang cập nhật...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <SaveOutlined className="mr-2" />
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                        >
                                            <EditOutlined className="mr-2" />
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">
                                            Tuổi
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="rounded-lg"
                                                type="number"
                                                min="0"
                                            />
                                        ) : (
                                            <p className="text-lg">
                                                {formData.age || "Chưa cập nhật"}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">
                                            Giới tính
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border p-2"
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                        ) : (
                                            <p className="text-lg">
                                                {displayGender(formData.gender)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">
                                            Địa chỉ
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-lg">
                                                {formData.address || "Chưa cập nhật"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t">
                                    <button
                                        onClick={handleChangePassword}
                                        className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
                                    >
                                        <LockOutlined className="mr-2" />
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default UserProfile;