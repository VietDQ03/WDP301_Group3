import React, { useEffect, useState } from "react";
import { companyApi } from "../../../api/AdminPageAPI/companyApi";

import {
    User,
    Mail,
    Calendar,
    FileText,
    Users,
    Building,
    Check,
    X,
    ChevronDown,
    Search,
    Loader,
    Settings,
    Power
} from "lucide-react";

const EditUserModal = ({
    visible,
    onCancel,
    onFinish,
    editingUser,
    roles,
    loading: formLoading,
}) => {
    const [companies, setCompanies] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [localSelectedRole, setLocalSelectedRole] = useState(editingUser?.role);
    const [formData, setFormData] = useState({
        name: editingUser?.name || "",
        email: editingUser?.email || "",
        age: editingUser?.age || "",
        gender: editingUser?.gender || "",
        address: editingUser?.address || "",
        role: editingUser?.role || "",
        company: editingUser?.company?._id || "",
        premium: editingUser?.premium || 0,
        isActived: editingUser?.isActived
    });

    const [isActivedChanged, setIsActivedChanged] = useState(false);

    // Khi modal hiển thị, đồng bộ dữ liệu ban đầu
    useEffect(() => {
        if (visible) {
            setLocalSelectedRole(editingUser?.role);
            setFormData({
                name: editingUser?.name || "",
                email: editingUser?.email || "",
                age: editingUser?.age || "",
                gender: editingUser?.gender || "",
                address: editingUser?.address || "",
                role: editingUser?.role || "",
                company: editingUser?.company?._id || "",
                premium: editingUser?.premium || 0,
                isActived: editingUser?.isActived
            });
            setIsActivedChanged(false);

            if (editingUser?.role === "67566b60671f5436a0de69a5") {
                fetchCompanies();
            }
        }
    }, [visible, editingUser]);

    // Hàm fetch danh sách công ty từ API
    const fetchCompanies = async (params = {}) => {
        setCompanyLoading(true);
        try {
            const searchParams = {
                current: params.current || 1,
                pageSize: params.pageSize || 100,
            };

            const response = await companyApi.getAll(searchParams);
            if (response?.data) {
                const { result } = response.data;
                setCompanies(
                    result.map((company) => ({
                        label: company.name,
                        value: company._id,
                        data: company,
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
        setCompanyLoading(false);
    };

    // Gọi fetchCompanies khi role là "67566b60671f5436a0de69a5"
    useEffect(() => {
        if (visible && localSelectedRole === "67566b60671f5436a0de69a5") {
            fetchCompanies();
        }
    }, [visible, localSelectedRole]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'isActived') {
            setIsActivedChanged(true);
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updateUserDto = {
            name: editingUser.name,
            age: editingUser.age,
            gender: editingUser.gender,
            address: editingUser.address,
            role: formData.role || editingUser.role,
            premium: parseInt(formData.premium),
            isActived: isActivedChanged ? formData.isActived === 'true' : editingUser.isActived
        };

        if (localSelectedRole === "67566b60671f5436a0de69a5" && formData.company) {
            const selectedCompany = companies.find(c => c.value === formData.company);
            if (selectedCompany) {
                updateUserDto.company = {
                    _id: selectedCompany.value,
                    name: selectedCompany.label
                };
            }
        }

        console.log(updateUserDto)
        onFinish?.(updateUserDto);
    };

    const handleCancel = () => {
        onCancel?.();
        setFormData({
            name: "",
            email: "",
            age: "",
            gender: "",
            address: "",
            role: "",
            company: "",
            premium: 0,
            isActived: editingUser?.isActived
        });
        setIsActivedChanged(false);
        setLocalSelectedRole(null);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="flex min-h-full items-center justify-center p-4 pt-10 text-center"
                onClick={handleCancel}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div
                    className="relative w-full max-w-[700px] transform rounded-lg bg-white text-left shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full relative">
                        <div className="flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg border-b border-blue-800">
                            <Users className="w-6 h-6 text-white" />
                            <div>
                                <h3 className="text-lg font-semibold text-white m-0">
                                    Chỉnh sửa thông tin người dùng
                                </h3>
                                <p className="text-blue-100 text-xs m-0 mt-1">
                                    Cập nhật vai trò người dùng
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">
                                        Thông tin cơ bản
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Tên người dùng
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                className="w-full h-10 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                className="w-full h-10 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">
                                        Thông tin cá nhân
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Tuổi
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={formData.age}
                                                className="w-full h-10 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Giới tính
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.gender === "MALE" ? "Nam" : "Nữ"}
                                            className="w-full h-10 pl-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium text-sm mb-2">
                                        Địa chỉ
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm min-h-[60px] p-3"
                                        disabled
                                    ></textarea>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">
                                        Thông tin vai trò
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Vai trò
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setLocalSelectedRole(e.target.value);
                                            }}
                                            required
                                            className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-sm"
                                        >
                                            <option value="">Chọn vai trò người dùng</option>
                                            {roles?.map((role) => (
                                                <option key={role._id} value={role._id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {localSelectedRole === "67566b60671f5436a0de69a5" && (
                                        <div>
                                            <label className="block text-gray-700 font-medium text-sm mb-2">
                                                Công ty
                                            </label>
                                            <div className="relative">
                                                {companyLoading ? (
                                                    <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                                                ) : (
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                )}
                                                <select
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-sm"
                                                >
                                                    <option value="">Tìm kiếm và chọn công ty</option>
                                                    {companies.map((company) => (
                                                        <option key={company.value} value={company.value}>
                                                            {company.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">
                                        Cài đặt khác
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Số lượt đăng bài
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                name="premium"
                                                min="0"
                                                value={formData.premium}
                                                onChange={handleInputChange}
                                                className="w-full h-10 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Trạng thái
                                        </label>
                                        <div className="relative">
                                            <Power className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                name="isActived"
                                                value={isActivedChanged ? formData.isActived : editingUser?.isActived}
                                                onChange={handleInputChange}
                                                className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-sm"
                                            >
                                                <option value={true}>Hoạt động</option>
                                                <option value={false}>Không hoạt động</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="h-10 px-6 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-300 border-2 flex items-center gap-2 text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="h-10 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white border-none inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {formLoading ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;