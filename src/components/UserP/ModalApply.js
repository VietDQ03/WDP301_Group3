import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { Upload, X, FileWarning, LogIn } from 'lucide-react';
import { callCreateResume, callUploadSingleFile } from "../../api/UserApi/UserApi";
import CustomButton from '../../components/CustomButton';

const ApplyModal = ({ isModalOpen, setIsModalOpen, jobDetail }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [urlCV, setUrlCV] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!urlCV && isAuthenticated) {
            alert("Vui lòng upload CV!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`);
        } else {
            if (jobDetail) {
                try {
                    const res = await callCreateResume(urlCV, jobDetail?.company?._id, jobDetail?._id);
                    if (res.data) {
                        alert("Rải CV thành công!");
                        setIsModalOpen(false);
                    } else {
                        alert(res.message || 'Có lỗi xảy ra');
                    }
                } catch (error) {
                    alert('Có lỗi xảy ra khi gửi CV');
                }
            }
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.fileName);
                alert(`${file.name} uploaded successfully`);
            } else {
                setUrlCV("");
                throw new Error(res.message || 'Upload failed');
            }
        } catch (error) {
            alert(error.message || 'Đã có lỗi xảy ra khi upload file');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    return (
        <Dialog 
            open={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            Ứng Tuyển Job
                        </Dialog.Title>
                    </div>

                    <div className="mt-4">
                        {isAuthenticated ? (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="text-sm text-gray-600">
                                        Bạn đang ứng tuyển công việc <span className="font-semibold">{jobDetail?.name}</span>{" "}
                                        tại <span className="font-semibold">{jobDetail?.company?.name}</span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Upload file CV
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <label className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                                <Upload className="mr-2 h-4 w-4" />
                                                {urlCV ? urlCV : "Tải lên CV của bạn"}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".doc,.docx,.pdf"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Hỗ trợ *.doc, *.docx, *.pdf, và &lt; 5MB
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <CustomButton
                                        htmlType="submit"
                                        icon={<Upload className="mr-2 h-4 w-4" />}
                                        className="w-full"
                                    >
                                        Rải CV Nào
                                    </CustomButton>
                                </div>
                            </form>
                        ) : (
                            <div className="py-6 px-4">
                                <div className="text-center">
                                    <FileWarning className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Bạn chưa đăng nhập
                                        </h3>
                                        <div className="mt-2 space-y-4">
                                            <p className="text-sm text-gray-500">
                                                Để ứng tuyển vào vị trí
                                                <span className="font-medium text-gray-900"> {jobDetail?.name} </span>
                                                tại
                                                <span className="font-medium text-gray-900"> {jobDetail?.company?.name}</span>,
                                                bạn cần đăng nhập trước.
                                            </p>
                                            <div className="rounded-lg bg-gray-50 p-4">
                                                <div className="text-sm text-gray-700">
                                                    <ul className="list-disc space-y-2 pl-5">
                                                        <li>Theo dõi trạng thái ứng tuyển</li>
                                                        <li>Nhận thông báo phỏng vấn</li>
                                                        <li>Quản lý hồ sơ ứng tuyển</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <CustomButton
                                        htmlType="button"
                                        icon={<LogIn className="mr-2 h-4 w-4" />}
                                        onClick={() => navigate(`/login?callback=${window.location.href}`)}
                                        style={{ width: "100%" }}
                                    >
                                        Đăng Nhập Ngay
                                    </CustomButton>
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ApplyModal;