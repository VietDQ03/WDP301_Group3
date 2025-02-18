import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAppliedJobs } from "../../api/UserApi/UserApi";
import { Link } from "react-router-dom";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";

const JobHistory = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppliedJobs();
        }
    }, [isAuthenticated]);

    const fetchAppliedJobs = async () => {
        try {
            const res = await getAppliedJobs();
            if (res.data) {
                setAppliedJobs(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách job đã apply:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-12 flex flex-col items-center" style={{height: '61vh'}}>
                <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                        Lịch Sử Ứng Tuyển
                    </h1>

                    {!isAuthenticated ? (
                        <p className="text-lg text-red-500 text-center">
                            Bạn cần đăng nhập để xem lịch sử ứng tuyển.
                        </p>
                    ) : appliedJobs.length === 0 ? (
                        <p className="text-lg text-gray-600 text-center">
                            Bạn chưa ứng tuyển công việc nào.
                        </p>
                    ) : (
                        <ul className="space-y-6">
                            {appliedJobs.map((job) => (
                                <li key={job._id} className="border p-5 rounded-lg shadow-md bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        {job?.jobId?.name}
                                    </h2>
                                    <Link
                                        to={`/job/${job?.jobId?._id}`}
                                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JobHistory;