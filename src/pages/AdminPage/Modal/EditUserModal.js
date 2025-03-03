import React, { useEffect, useState } from 'react';
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
    Loader
} from 'lucide-react';

const EditUserModal = ({
    visible,
    onCancel,
    onFinish,
    editingUser,
    roles,
    loading: formLoading,
    selectedRole,
    setSelectedRole,
    form
}) => {
    const [companies, setCompanies] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [localSelectedRole, setLocalSelectedRole] = useState(editingUser?.role);
    const [formData, setFormData] = useState({
        name: editingUser?.name || '',
        email: editingUser?.email || '',
        age: editingUser?.age || '',
        gender: editingUser?.gender || '',
        address: editingUser?.address || '',
        role: editingUser?.role || '',
        company: editingUser?.company?._id || ''
    });

    useEffect(() => {
        if (visible) {
            setLocalSelectedRole(editingUser?.role);
            setFormData({
                name: editingUser?.name || '',
                email: editingUser?.email || '',
                age: editingUser?.age || '',
                gender: editingUser?.gender || '',
                address: editingUser?.address || '',
                role: editingUser?.role || '',
                company: editingUser?.company?._id || ''
            });
        }
    }, [visible, editingUser]);

    const fetchCompanies = async (search = '') => {
        setCompanyLoading(true);
        try {
            const mockCompanies = [
                { id: 1, name: "Company A" },
                { id: 2, name: "Company B" }
            ];
            setCompanies(mockCompanies.map(company => ({
                label: company.name,
                value: company.id,
                data: company
            })));
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
        setCompanyLoading(false);
    };

    useEffect(() => {
        if (visible && localSelectedRole === '67566b60671f5436a0de69a5') {
            fetchCompanies();
        }
    }, [visible, localSelectedRole]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCompany = companies.find(c => c.value.toString() === formData.company)?.data;
        onFinish?.({
            ...formData,
            company: selectedCompany
        });
    };

    const handleCancel = () => {
        onCancel?.();
        setFormData({
            name: '',
            email: '',
            age: '',
            gender: '',
            address: '',
            role: '',
            company: ''
        });
        setLocalSelectedRole(editingUser?.role);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
                className="flex min-h-full items-center justify-center p-4 pt-20 text-center"
                onClick={handleCancel}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div 
                    className="relative w-full max-w-[700px] transform rounded-lg bg-white text-left shadow-xl transition-all"
                    onClick={e => e.stopPropagation()}
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
                            {/* Basic Information Section */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">Thông tin cơ bản</h3>
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
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">Thông tin cá nhân</h3>
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
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                                className="w-full h-10 pl-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                                disabled
                                            />
                                        </div>
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

                            {/* Role & Company Section */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm m-0">Thông tin vai trò</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium text-sm mb-2">
                                            Vai trò
                                        </label>
                                        <div className="relative">
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
                                                {roles?.map(role => (
                                                    <option key={role._id} value={role._id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {localSelectedRole === '67566b60671f5436a0de69a5' && (
                                        <div>
                                            <label className="block text-gray-700 font-medium text-sm mb-2">
                                                Công ty
                                            </label>
                                            <div className="relative">
                                                {companyLoading ? (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                                                    </div>
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
                                                    {companies.map(company => (
                                                        <option key={company.value} value={company.value}>
                                                            {company.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}
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