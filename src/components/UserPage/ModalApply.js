import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { Upload, FileWarning, LogIn, Building2, Briefcase, FileText, Download } from 'lucide-react';
import { callCreateResume, callUploadSingleFile } from "../../api/UserApi/UserApi";
import { cvAPI } from "../../api/cvAPI";
import CustomButton from '../../components/Other/CustomButton';
import { motion } from 'framer-motion';

const ApplyModal = ({ isModalOpen, setIsModalOpen, jobDetail }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [coverLetter, setCoverLetter] = useState("");
    const [urlCV, setUrlCV] = useState("");
    const [userCVs, setUserCVs] = useState([]);
    const [selectedExistingCV, setSelectedExistingCV] = useState("");
    const [uploadType, setUploadType] = useState("existing"); // "existing" or "new"
    const navigate = useNavigate();

    // Fetch user's existing CVs when modal opens
    useEffect(() => {
        const fetchUserCVs = async () => {
            if (isModalOpen && isAuthenticated && user?._id) {
                try {
                    const response = await cvAPI.findAllByUserId(user._id);
                    
                    // Check if response has data with the expected structure
                    if (response.statusCode === 200 && response.data) {
                        // Handle both array and single object responses
                        const cvData = Array.isArray(response.data) ? response.data : [response.data];
                        setUserCVs(cvData);
                        
                        if (cvData.length > 0) {
                            setSelectedExistingCV(cvData[0].url);
                            setUploadType("existing");
                        } else {
                            setUploadType("new");
                        }
                    } else if (response.url) {
                        // Handle direct URL response (fallback for older API format)
                        setUserCVs([{ url: response.url, createdAt: new Date() }]);
                        setSelectedExistingCV(response.url);
                        setUploadType("existing");
                    } else {
                        setUserCVs([]);
                        setUploadType("new");
                    }
                } catch (error) {
                    console.error("Error fetching user CVs:", error);
                    setUploadType("new");
                }
            }
        };
        fetchUserCVs();
    }, [isModalOpen, isAuthenticated, user]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setCoverLetter("");
            setUrlCV("");
            setSelectedExistingCV("");
            if (jobDetail?._id) {
                localStorage.removeItem(`apply_form_${jobDetail._id}`);
            }
        }
    }, [isModalOpen, jobDetail]);

    // Load saved form data when modal opens
    useEffect(() => {
        if (isModalOpen && isAuthenticated && jobDetail?._id) {
            const savedData = localStorage.getItem(`apply_form_${jobDetail._id}`);
            if (savedData) {
                const { coverLetter: savedCoverLetter } = JSON.parse(savedData);
                setCoverLetter(savedCoverLetter || "");
            }
        }
    }, [isModalOpen, isAuthenticated, jobDetail]);

    // Save form data when it changes
    useEffect(() => {
        if (isModalOpen && isAuthenticated && jobDetail?._id) {
            const formData = {
                coverLetter,
                uploadType,
                selectedExistingCV,
                urlCV
            };
            localStorage.setItem(`apply_form_${jobDetail._id}`, JSON.stringify(formData));
        }
    }, [coverLetter, uploadType, selectedExistingCV, urlCV, isModalOpen, isAuthenticated, jobDetail]);

    const handleClose = () => {
        setCoverLetter("");
        setUrlCV("");
        setSelectedExistingCV("");
        if (jobDetail?._id) {
            localStorage.removeItem(`apply_form_${jobDetail._id}`);
        }
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const finalCV = uploadType === "existing" ? selectedExistingCV : urlCV;
    
        if (!finalCV && isAuthenticated) {
            alert("Vui lòng chọn hoặc tải lên CV!");
            return;
        }
    
        if (!isAuthenticated) {
            handleClose();
            navigate(`/login?callback=${window.location.href}`);
        } else {
            if (jobDetail) {
                try {
                    const res = await callCreateResume(
                        finalCV,
                        jobDetail?.company?._id,
                        jobDetail?._id,
                        coverLetter
                    );
    
                    if (res.data) {
                        alert("Ứng tuyển thành công!");
                        handleClose();
                    } else {
                        alert(res.message || 'Có lỗi xảy ra');
                    }
                } catch (error) {
                    if (error.response) {
                        const errorData = error.response.data;
                        alert(errorData.message || 'Có lỗi xảy ra khi gửi CV');
                    } else if (error.message) {
                        alert(error.message);
                    } else {
                        alert('Có lỗi xảy ra khi gửi CV');
                    }
                }
            }
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.url);
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

    const downloadCV = (cvUrl) => {
        if (cvUrl) {
            window.open(`${process.env.REACT_APP_BASE_URL}/images/resume/${cvUrl}`, '_blank');
        }
    };

    const getFileName = (url) => {
        if (!url) return "";
        return url.length > 25 ? url.substring(0, 25) + '...' : url;
    };

    const renderCVSection = () => (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
                CV của bạn
            </label>

            {/* Upload type selection - Improved UI */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {userCVs.length > 0 && (
                    <div 
                        onClick={() => setUploadType("existing")}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            uploadType === "existing" 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-gray-200 hover:border-blue-300"
                        }`}
                    >
                        <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-blue-100">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="font-medium text-center">Sử dụng CV có sẵn</p>
                        <div className="mt-2 flex items-center">
                            <div className={`w-5 h-5 rounded-full border ${uploadType === "existing" ? "border-blue-500" : "border-gray-300"} flex items-center justify-center`}>
                                {uploadType === "existing" && (
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                <div 
                    onClick={() => setUploadType("new")}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        uploadType === "new" 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                    <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-blue-100">
                        <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-medium text-center">Tải lên CV mới</p>
                    <div className="mt-2 flex items-center">
                        <div className={`w-5 h-5 rounded-full border ${uploadType === "new" ? "border-blue-500" : "border-gray-300"} flex items-center justify-center`}>
                            {uploadType === "new" && (
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing CVs selection */}
            {uploadType === "existing" && userCVs.length > 0 && (
                <div className="space-y-3">
                    {userCVs.map((cv, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedExistingCV === cv.url
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                            onClick={() => setSelectedExistingCV(cv.url)}
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {getFileName(cv.url)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(cv.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadCV(cv.url);
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                        title="Tải xuống CV"
                                    >
                                        <Download className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500">
                                        {selectedExistingCV === cv.url && (
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New CV upload */}
            {uploadType === "new" && (
                <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="flex flex-col items-center text-sm">
                            {urlCV ? (
                                <>
                                    <span className="font-medium text-blue-600">
                                        {getFileName(urlCV)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setUrlCV("")}
                                        className="mt-2 text-xs text-red-500 hover:text-red-700"
                                    >
                                        Xóa file
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-600">Tải lên CV mới</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC up to 1MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".doc,.docx,.pdf"
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    );

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleClose}
            className="relative z-[999]"
        >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000]">
                <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-gray-50 p-6 max-h-[90vh] overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                            Ứng Tuyển Việc Làm
                        </Dialog.Title>

                        <div className="space-y-6">
                            {isAuthenticated ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Job info */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{jobDetail?.name}</h3>
                                        <div className="flex items-center text-gray-600">
                                            <Building2 className="w-5 h-5 mr-2" />
                                            {jobDetail?.company?.name}
                                        </div>
                                    </div>

                                    {/* Form fields */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                                        {/* Email field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Email Liên Hệ
                                            </label>
                                            <input
                                                type="email"
                                                value={user?.email}
                                                disabled
                                                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Cover letter field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Thư Ứng Tuyển
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                placeholder="Viết thư giới thiệu bản thân và mong muốn ứng tuyển vào vị trí này..."
                                                className="mt-1 block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Hãy nêu rõ kinh nghiệm, kỹ năng và lý do bạn phù hợp với vị trí này
                                            </p>
                                        </div>

                                        {/* CV selection/upload section */}
                                        {renderCVSection()}
                                    </div>

                                    {/* Submit button */}
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <CustomButton
                                            htmlType="submit"
                                            icon={<Upload className="mr-2 h-4 w-4" />}
                                            className="px-6 py-2 rounded-lg font-medium"
                                        >
                                            Gửi Hồ Sơ Ứng Tuyển
                                        </CustomButton>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                            <FileWarning className="h-8 w-8 text-red-600" />
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Bạn cần đăng nhập để ứng tuyển
                                            </h3>
                                            <div className="mt-4 space-y-6">
                                                <p className="text-gray-600">
                                                    Để ứng tuyển vào vị trí
                                                    <span className="font-semibold text-gray-900"> {jobDetail?.name} </span>
                                                    tại
                                                    <span className="font-semibold text-gray-900"> {jobDetail?.company?.name}</span>,
                                                    vui lòng đăng nhập tài khoản của bạn.
                                                </p>

                                                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                                    <h4 className="font-semibold text-gray-900">Lợi ích khi đăng nhập:</h4>
                                                    <div className="mt-3 space-y-3 text-sm text-gray-700">
                                                        <div className="flex items-center">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                                <span className="text-blue-600">1</span>
                                                            </div>
                                                            <span className="ml-3">Theo dõi trạng thái ứng tuyển</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                                <span className="text-blue-600">2</span>
                                                            </div>
                                                            <span className="ml-3">Nhận thông báo phỏng vấn</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                                <span className="text-blue-600">3</span>
                                                            </div>
                                                            <span className="ml-3">Quản lý hồ sơ ứng tuyển</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <CustomButton
                                                htmlType="button"
                                                icon={<LogIn className="mr-2 h-5 w-5" />}
                                                onClick={() => {
                                                    handleClose();
                                                    navigate(`/login?callback=${window.location.href}`);
                                                }}
                                                className="w-full rounded-lg py-3 text-lg font-medium"
                                            >
                                                Đăng Nhập Ngay
                                            </CustomButton>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ApplyModal;