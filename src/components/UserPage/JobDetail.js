import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import ApplyModal from "./ModalApply";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import Header from "./Header";
import Footer from "./Footer";
import CustomButton from "../Other/CustomButton";
import { DollarSign, MapPin, Users, Briefcase, Clock, Building2 } from "lucide-react";

const getLocationName = (location) => {
    const locationMap = {
        'HANOI': 'Hà Nội',
        'HOCHIMINH': 'Hồ Chí Minh',
        'DANANG': 'Đà Nẵng',
        'OTHER': 'Khác'
    };
    return locationMap[location] || location;
};

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const response = await jobApi.getOne(id);
                setJob(response);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết công việc:", error);
                message.error("Không tìm thấy công việc!");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Spin tip="Đang tải..." size="large" />
            </div>
        );
    }

    if (!job) {
        return <div className="min-h-screen flex justify-center items-center text-red-500 text-xl font-semibold">Không tìm thấy công việc!</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="w-20 h-20 rounded-xl border border-gray-200 p-2 bg-white"
                                            src={job.company?.logo
                                                ? `${process.env.REACT_APP_BASE_URL}/images/company/${job.company.logo}`
                                                : '/logo.png'
                                            }
                                            alt={job.company?.name}
                                            onError={(e) => {
                                                e.target.src = '/logo.png';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.name}</h1>
                                        <div className="flex items-center text-gray-600 mb-4">
                                            <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                                            <span className="font-medium">{job.company?.name}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                                                <span>{getLocationName(job.location)}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                                                <span>{job.salary?.toLocaleString()} đ</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="w-4 h-4 text-purple-500 mr-2" />
                                                <span>{job.quantity} vị trí</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Briefcase className="w-4 h-4 text-orange-500 mr-2" />
                                                <span>{job.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Kỹ năng yêu cầu</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills?.map((skill) => (
                                            <span
                                                key={skill._id}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <CustomButton
                                    htmlType="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-6 w-full py-3 text-base font-semibold rounded-xl"
                                >
                                    Ứng tuyển ngay
                                </CustomButton>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
                                <div
                                    className="prose max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: job.description || "Chưa có mô tả." }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col items-center">
                                    <img
                                        className="w-24 h-24 rounded-xl border border-gray-200 p-2 bg-white"
                                        src={job.company?.logo
                                            ? `${process.env.REACT_APP_BASE_URL}/images/company/${job.company.logo}`
                                            : '/logo.png'
                                        }
                                        alt={job.company?.name}
                                        onError={(e) => {
                                            e.target.src = '/logo.png';
                                        }}
                                    />
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{job.company?.name}</h3>
                                    <p className="mt-2 text-sm text-gray-500 text-center">
                                        Công ty uy tín - Môi trường làm việc năng động
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={job} />
            <Footer />
        </div>
    );
};

export default JobDetail;