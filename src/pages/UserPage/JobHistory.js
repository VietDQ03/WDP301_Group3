import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { getAppliedJobs } from "../../api/UserApi/UserApi";
import { Link } from "react-router-dom";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import Header from "../../components/UserPage/Header";
import {
    Briefcase, Building2, Calendar, FileText, ExternalLink,
    Clock, CheckCircle2, XCircle, DollarSign, Loader2
} from "lucide-react";

const Footer = lazy(() => import("../../components/UserPage/Footer"));

const JobHistory = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleJobs, setVisibleJobs] = useState(10);
    const [jobDetailsMap, setJobDetailsMap] = useState(new Map());

    const formatSalary = useMemo(() => (salary) => {
        if (!salary) return "Thỏa thuận";
        if (typeof salary === 'string' && salary.includes('-')) {
            const [min, max] = salary.split('-').map(s => parseInt(s.trim()));
            return `${min.toLocaleString('vi-VN')}đ - ${max.toLocaleString('vi-VN')}đ`;
        }
        const numSalary = parseInt(salary);
        return !isNaN(numSalary) ? `${numSalary.toLocaleString('vi-VN')}đ` : salary;
    }, []);

    const formatDate = useMemo(() => (dateString) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date(dateString));
    }, []);

    const fetchJobDetails = async (jobIds) => {
        const uniqueJobIds = [...new Set(jobIds)];
        const newJobDetails = new Map(jobDetailsMap);
        
        const jobsToFetch = uniqueJobIds.filter(id => !newJobDetails.has(id));
        
        if (jobsToFetch.length === 0) return newJobDetails;

        try {
            const responses = await Promise.all(
                jobsToFetch.map(id => jobApi.getOne(id))
            );
            
            responses.forEach((response, index) => {
                newJobDetails.set(jobsToFetch[index], response);
            });
            
            setJobDetailsMap(newJobDetails);
            return newJobDetails;
        } catch (error) {
            console.error("Error fetching job details:", error);
            return newJobDetails;
        }
    };

    const fetchAppliedJobs = async () => {
        if (!isAuthenticated) return;
        
        setIsLoading(true);
        try {
            const res = await getAppliedJobs();
            if (res.data) {
                const jobIds = res.data.map(job => job.jobId._id);
                await fetchJobDetails(jobIds);
                setAppliedJobs(res.data);
            }
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppliedJobs();
    }, [isAuthenticated]);

    const handleScroll = useMemo(() => {
        let timeout;
        return () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (
                    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
                    visibleJobs < appliedJobs.length
                ) {
                    setVisibleJobs(prev => prev + 10);
                }
            }, 100);
        };
    }, [visibleJobs, appliedJobs.length]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const getStatusInfo = useMemo(() => (status) => ({
        PENDING: { icon: <Clock className="w-5 h-5 text-orange-500" />, text: "Đang chờ", color: "text-orange-500" },
        APPROVED: { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, text: "Phù hợp", color: "text-green-500" },
        REJECTED: { icon: <XCircle className="w-5 h-5 text-red-500" />, text: "Chưa phù hợp", color: "text-red-500" }
    }[status] || { icon: <XCircle className="w-5 h-5 text-red-500" />, text: "Chưa phù hợp", color: "text-red-500" }), []);

    const handleViewCV = (url) => {
        if (!url) return;
        window.open(`${process.env.REACT_APP_BASE_URL}/images/resume/${url}`, '_blank');
    };

    const visibleJobsList = appliedJobs.slice(0, visibleJobs);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-500">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6" />
                                Việc làm đã ứng tuyển
                            </h1>
                        </div>

                        <div className="p-6">
                            {!isAuthenticated ? (
                                <div className="text-center py-8">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-red-500">Bạn cần đăng nhập để xem lịch sử ứng tuyển.</p>
                                </div>
                            ) : isLoading ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                                </div>
                            ) : visibleJobsList.length === 0 ? (
                                <div className="text-center py-8">
                                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-gray-600">Bạn chưa ứng tuyển công việc nào.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {visibleJobsList.map((job) => {
                                        const jobDetails = jobDetailsMap.get(job.jobId._id);
                                        const statusInfo = getStatusInfo(job?.status);
                                        return (
                                            <div key={job._id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6">
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
                                                                {formatDate(job.createdAt)}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                                <span className="font-semibold text-green-600">
                                                                    {formatSalary(jobDetails?.salary || job?.jobId?.salary)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {statusInfo.icon}
                                                                <span className={`font-medium ${statusInfo.color}`}>
                                                                    {statusInfo.text}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <button
                                                            onClick={() => handleViewCV(job?.url)}
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            Xem CV
                                                        </button>
                                                        <Link
                                                            to={`/job/${job?.jobId?._id}`}
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 gap-2"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            Xem Công Việc
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
};

export default JobHistory;