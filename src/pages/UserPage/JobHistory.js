import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAppliedJobs } from "../../api/UserApi/UserApi";
import { Link } from "react-router-dom";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import {
    Briefcase,
    Building2,
    Calendar,
    FileText,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    DollarSign
} from "lucide-react";
import CustomButton from "../../components/Other/CustomButton";

const JobHistory = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [appliedJobs, setAppliedJobs] = useState([]);

    const formatSalary = (salary) => {
        if (!salary) return "Thỏa thuận";

        if (typeof salary === 'string' && salary.includes('-')) {
            const [min, max] = salary.split('-').map(s => parseInt(s.trim()));
            return `${min.toLocaleString('vi-VN')}đ - ${max.toLocaleString('vi-VN')}đ`;
        }

        // Nếu salary là một số
        const numSalary = parseInt(salary);
        if (!isNaN(numSalary)) {
            return `${numSalary.toLocaleString('vi-VN')}đ`;
        }

        // Trường hợp khác
        return salary;
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppliedJobs();
        }
    }, [isAuthenticated]);

    const fetchJobDetails = async (jobId) => {
        try {
            const response = await jobApi.getOne(jobId);
            return response;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết job:", error);
            return null;
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const res = await getAppliedJobs();
            if (res.data) {
                const jobsWithDetails = await Promise.all(
                    res.data.map(async (job) => {
                        const jobDetails = await fetchJobDetails(job.jobId._id);
                        return {
                            ...job,
                            jobDetails: jobDetails
                        };
                    })
                );
                setAppliedJobs(jobsWithDetails);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách job đã apply:", error);
        }
    };

    const handleViewCV = (url) => {
        if (!url) {
            console.error("URL is undefined or empty");
            return;
        }

        const fileUrl = `${process.env.REACT_APP_BASE_URL}/images/resume/${url}`;
        window.open(fileUrl, '_blank');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return <Clock className="w-5 h-5 text-orange-500" />;
            case "APPROVED":
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default:
                return <XCircle className="w-5 h-5 text-red-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "PENDING":
                return "đang chờ";
            case "APPROVED":
                return "phù hợp";
            default:
                return "chưa phù hợp";
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-800 px-6 py-4">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6" />
                                Việc làm đã ứng tuyển
                            </h1>
                        </div>

                        <div className="p-6">
                            {!isAuthenticated ? (
                                <div className="text-center py-8">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-red-500">
                                        Bạn cần đăng nhập để xem lịch sử ứng tuyển.
                                    </p>
                                </div>
                            ) : appliedJobs.length === 0 ? (
                                <div className="text-center py-8">
                                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-gray-600">
                                        Bạn chưa ứng tuyển công việc nào.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {appliedJobs.map((job) => (
                                        <li
                                            key={job._id}
                                            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                                        {job?.jobId?.name}
                                                    </h2>

                                                    <div className="space-y-2">
                                                        <p className="text-gray-700 flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-gray-500" />
                                                            {job?.companyId?.name}
                                                        </p>

                                                        <p className="text-gray-600 flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            {new Date(job.createdAt).toLocaleString()}
                                                        </p>

                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                            <span className="font-semibold text-green-600">
                                                                {formatSalary(job?.jobDetails?.salary || job?.jobId?.salary || "Thỏa thuận")}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(job?.status)}
                                                            <span className={`font-medium ${job?.status === "PENDING" ? "text-orange-500" :
                                                                job?.status === "APPROVED" ? "text-green-500" :
                                                                    "text-red-500"
                                                                }`}>
                                                                {getStatusText(job?.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <CustomButton
                                                        onClick={() => handleViewCV(job?.url)}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Xem CV
                                                    </CustomButton>
                                                    <Link
                                                        to={`/job/${job?.jobId?._id}`}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 gap-2"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Xem Công Việc
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JobHistory;