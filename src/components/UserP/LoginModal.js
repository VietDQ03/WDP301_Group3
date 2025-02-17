import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { FileWarning, LogIn } from 'lucide-react';
import CustomButton from '../../components/CustomButton';

const LoginModal = ({ isModalOpen, setIsModalOpen, modalMessage }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
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
        } else if (modalMessage) {
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
                                {modalMessage}
                            </p>
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