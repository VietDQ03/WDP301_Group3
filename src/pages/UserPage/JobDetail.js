import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ApplyModal from "../../components/UserP/ModalApply";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";


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
                setJob(response.data);
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
            <div className="flex justify-center items-center h-screen">
                <div className="w-3/4 h-32 bg-gray-200 animate-pulse rounded-lg" />
            </div>
        );
    }

    if (!job) {
        return <div className="text-center text-red-500 text-lg">Không tìm thấy công việc!</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="p-6 shadow-lg rounded-lg border border-gray-300">
                <h1 className="text-2xl font-bold mb-4">{job.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="material-icons">place</span>
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <span className="material-icons">attach_money</span>
                    <span>{job.salary?.toLocaleString()} đ</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <span className="material-icons">access_time</span>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Ứng tuyển ngay
                </button>
            </div>
            <div className="p-6 shadow-lg rounded-lg border border-gray-300">
                <h2 className="text-lg font-semibold">Mô tả công việc</h2>
                <p className="text-gray-700 mt-2">{job.description}</p>
            </div>
            <div className="p-6 shadow-lg rounded-lg border border-gray-300 flex items-center gap-4">
                <img 
                    className="w-16 h-16 rounded-full border border-gray-300" 
                    src={`http://localhost:8000/images/company/${job.company?.logo}`} 
                    alt="Company Logo" 
                />
                <div>
                    <h3 className="text-lg font-semibold">{job.company?.name}</h3>
                </div>
            </div>
            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={job} />
        </div>
    );
};

export default JobDetail;
