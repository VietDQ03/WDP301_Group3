import React from 'react';
import { Dialog } from '@headlessui/react';
import {
    Mail,
    FileText,
    Calendar,
    User,
    CheckCircle2,
    Briefcase,
    Clock,
    Send,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ViewResumeModal = ({
    isOpen,
    onClose,
    resumeData,
}) => {
    const [showAllHistory, setShowAllHistory] = React.useState(false);

    if (!resumeData) return null;
    const coverLetter = `Kính gửi Phòng Nhân sự,

Tôi viết thư này để bày tỏ sự quan tâm của mình đối với vị trí [Tên công việc] tại công ty của bạn. Với hơn 3 năm kinh nghiệm trong lĩnh vực này, tôi tin rằng các kỹ năng và kinh nghiệm của tôi sẽ là một sự bổ sung có giá trị cho đội ngũ của bạn.

Trong vai trò hiện tại của mình, tôi đã:
• Phát triển và triển khai các giải pháp phần mềm cho nhiều dự án lớn
• Làm việc hiệu quả trong môi trường nhóm đa văn hóa
• Đạt được các mục tiêu dự án trong thời hạn và ngân sách

Tôi rất ấn tượng với sự phát triển và đổi mới của công ty trong những năm qua. Tôi tin rằng tầm nhìn của công ty phù hợp hoàn hảo với các mục tiêu nghề nghiệp của tôi.

Tôi mong muốn có cơ hội thảo luận thêm về cách tôi có thể đóng góp cho sự thành công của công ty.

Trân trọng,
[Tên ứng viên]`;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const displayedHistory = showAllHistory
        ? resumeData.history
        : resumeData.history?.slice(-3);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'APPROVED':
                return 'bg-green-100 text-green-700 border border-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-700 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
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
                <Dialog.Panel className="w-full max-w-4xl rounded-xl bg-gray-50 p-6 max-h-[90vh] overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            Hồ sơ ứng tuyển
                        </Dialog.Title>

                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {resumeData.userName || 'N/A'}
                                        </h3>
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-5 h-5 mr-2" />
                                            {resumeData.email}
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(resumeData.status)}`}>
                                        {getStatusText(resumeData.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DescriptionItem
                                    icon={User}
                                    label="Họ và tên"
                                    value={resumeData.userName || 'N/A'}
                                />
                                <DescriptionItem
                                    icon={Mail}
                                    label="Email"
                                    value={resumeData.email}
                                />
                                <DescriptionItem
                                    icon={Briefcase}
                                    label="Vị trí ứng tuyển"
                                    value={resumeData.jobName || 'N/A'}
                                />
                                <DescriptionItem
                                    icon={Calendar}
                                    label="Ngày nộp"
                                    value={formatDate(resumeData.createdAt)}
                                />
                            </div>

                            {/* Timeline Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Lịch sử trạng thái</h3>
                                </div>
                                <div className="space-y-6">
                                    {/* Initial submission entry - Hiển thị đầu tiên */}
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-blue-100 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        </div>
                                        {resumeData.history?.length > 0 && (
                                            <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200"></div>
                                        )}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                    Nộp hồ sơ
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(resumeData.createdAt)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>Người nộp: {resumeData.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {!showAllHistory && resumeData.history?.length > 3 && (
                                        <div className="pl-8 flex items-center gap-2">
                                            <span className="text-sm text-gray-500 italic">
                                                ... và {resumeData.history.length - 3} cập nhật trước đó
                                            </span>
                                            <button
                                                onClick={() => setShowAllHistory(true)}
                                                className="text-sm text-blue-600 hover:text-blue-700 inline-block hover:underline "
                                            >
                                                xem thêm
                                            </button>
                                        </div>
                                    )}
                                    {/* History entries */}
                                    {(showAllHistory ? resumeData.history : resumeData.history?.slice(-3))?.map((historyItem, index, array) => (
                                        <div key={index} className="relative pl-8">
                                            {/* Vertical line */}
                                            {index !== array.length - 1 && (
                                                <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200"></div>
                                            )}

                                            {/* Status dot with different colors based on status */}
                                            <div className={`absolute left-0 top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center
                    ${historyItem.status === 'PENDING' ? 'bg-yellow-100' :
                                                    historyItem.status === 'APPROVED' ? 'bg-green-100' :
                                                        'bg-red-100'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full
                        ${historyItem.status === 'PENDING' ? 'bg-yellow-500' :
                                                        historyItem.status === 'APPROVED' ? 'bg-green-500' :
                                                            'bg-red-500'}`}>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                            ${historyItem.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                            historyItem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'}`}>
                                                        {historyItem.status === 'PENDING' ? 'Đang chờ' :
                                                            historyItem.status === 'APPROVED' ? 'Đã duyệt' :
                                                                'Từ chối'}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(historyItem.updatedAt)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>Cập nhật bởi: {historyItem.updatedBy?.email || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Nút ẩn bớt khi đang hiển thị tất cả */}
                                    {showAllHistory && resumeData.history?.length > 3 && (
                                        <div className="pl-8">
                                            <button
                                                onClick={() => setShowAllHistory(false)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
                                            >
                                                Ẩn bớt
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Send className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Thư ứng tuyển</h3>
                                </div>
                                <div className="prose max-w-none whitespace-pre-wrap text-gray-600">
                                    {coverLetter}
                                </div>
                            </div>

                            {/* Attachment Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">File đính kèm</h3>
                                </div>
                                <a
                                    href={`${process.env.REACT_APP_BASE_URL}/images/resume/${resumeData.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium group"
                                >
                                    <FileText className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                                    Xem hồ sơ đính kèm
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