import React from 'react';
import { Dialog } from '@headlessui/react';
import {
    Mail,
    FileText,
    Calendar,
    User,
    CheckCircle2,
    Briefcase,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ViewResumeModal = ({
    isOpen,
    onClose,
    resumeData,
}) => {
    if (!resumeData) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'APPROVED':
                return 'bg-green-100 text-green-700';
            case 'REJECTED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Đang chờ';
            case 'APPROVED':
                return 'Đã duyệt';
            case 'REJECTED':
                return 'Từ chối';
            default:
                return status;
        }
    };

    const DescriptionItem = ({ icon: Icon, label, value, isTag = false }) => (
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
            </div>
            {isTag ? (
                <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(value)}`}>
                        {getStatusText(value)}
                    </span>
                </div>
            ) : (
                <div className="text-gray-900 font-medium">{value}</div>
            )}
        </div>
    );

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-gray-50 p-6 max-h-[90vh] overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            Chi tiết hồ sơ ứng tuyển
                        </Dialog.Title>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DescriptionItem
                                    icon={Mail}
                                    label="Email"
                                    value={resumeData.email}
                                />
                                <DescriptionItem 
                                    icon={User}
                                    label="Tên ứng viên"
                                    value={resumeData.userId}
                                />
                                <DescriptionItem
                                    icon={Briefcase}
                                    label="Ứng tuyển công việc"
                                    value={resumeData.jobId}
                                />
                                <DescriptionItem
                                    icon={CheckCircle2}
                                    label="Trạng thái"
                                    value={resumeData.status}
                                    isTag={true}
                                />
                                <DescriptionItem
                                    icon={Calendar}
                                    label="Ngày tạo"
                                    value={formatDate(resumeData.createdAt)}
                                />
                                <DescriptionItem
                                    icon={Calendar}
                                    label="Cập nhật lần cuối"
                                    value={formatDate(resumeData.updatedAt)}
                                />
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">File hồ sơ</h3>
                                </div>
                                <a
                                    href={`${process.env.REACT_APP_BASE_URL}/images/resume/${resumeData.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Xem hồ sơ
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ViewResumeModal;