import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { Facebook, FileWarning, LogIn } from 'lucide-react';
import CustomButton from '../Other/CustomButton';

const LoginModal = ({ isModalOpen, setIsModalOpen }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleModalContent = () => {
        if (!isAuthenticated) {
            return (
                <div className="py-6 px-4">
                    <div className="text-center">
                        <FileWarning className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Bạn chưa đăng nhập
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Vui lòng đăng nhập để có thể thêm các công việc mới.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <CustomButton
                            htmlType="button"
                            icon={<LogIn className="mr-2 h-4 w-4" />}
                            onClick={() => {
                                setIsModalOpen(false);
                                navigate(`/login?callback=${window.location.href}`);
                            }}
                            style={{ width: "100%" }}
                        >
                            Đăng Nhập Ngay
                        </CustomButton>
                    </div>
                </div>
            );
        } else if (user?.role?.name !== "HR_ROLE") {
            // Trường hợp NORMAL_USER hoặc các thông báo khác
            return (
                <div className="py-6 px-4">
                    <div className="text-center">
                        <FileWarning className="mx-auto h-12 w-12 text-red-500" />
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-red-600">
                                Thông báo
                            </h3>
                            <p className="text-sm text-gray-700 mt-2">
                                Bạn không có quyền đăng tuyển công việc. Vui lòng sử dụng tài khoản HR để có thể đăng tuyển.
                            </p>
                            <div className="mt-4 space-y-3">
                                <p className="text-sm text-red-600">
                                    Liên hệ với chúng tôi để được hỗ trợ:
                                </p>
                                <div className="flex flex-col items-center space-y-2"> 
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61551537480234&mibextid=wwXIfr&rdid=IJvbMvKBsJvBuO6V&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F12H8M3Uo3Eh%2F%3Fmibextid%3DwwXIfr#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors" 
                                    >
                                        <Facebook className="w-5 h-5 mr-2" />
                                        Facebook: Rabota
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <CustomButton
                            htmlType="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{ width: "100%" }}
                        >
                            Đóng
                        </CustomButton>
                    </div>
                </div>
            );
        }
    };


    return (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            Đăng tuyển Công việc
                        </Dialog.Title>
                    </div>
                    <div className="mt-4">
                        {handleModalContent()}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default LoginModal;