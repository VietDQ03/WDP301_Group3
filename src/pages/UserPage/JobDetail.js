import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import ApplyModal from "../../components/UserP/ModalApply";
import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import CustomButton from "../../components/Other/CustomButton";
import { DollarSign, MapPin } from "lucide-react";


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
            <div className="flex justify-center items-center h-screen">
                <Spin tip="Đang tải..." />
            </div>
        );
    }

    if (!job) {
        return <div className="text-center text-red-500 text-lg mt-10">Không tìm thấy công việc!</div>;
    }

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột chính: Thông tin và mô tả công việc */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white shadow-md rounded-xl border border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-800">{job.name}</h1>
                        <div className="mt-3 flex flex-wrap gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <span className="font-semibold text-lg">{job.salary?.toLocaleString()} đ</span>
                            </div>
                        </div>
                        <CustomButton
                            htmlType="button"
                            onClick={() => setIsModalOpen(true)}
                            className="mt-10 w-full py-3 text-lg font-semibold"
                            style={{ width: "100%", marginTop: "15px" }}
                        >
                            Ứng tuyển ngay
                        </CustomButton>
                    </div>

                    <div className="p-6 bg-white shadow-md rounded-xl border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Mô tả công việc</h2>
                        <p
                            className="text-gray-700 mt-4 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: job.description || "Chưa có mô tả." }}
                        />
                    </div>
                </div>

                {/* Cột bên phải: Thông tin công ty + Nút ứng tuyển */}
                <div className="space-y-6">
                    <div className="p-6 bg-white shadow-md rounded-xl border border-gray-200 flex flex-col items-center text-center">
                        <img
                            className="w-24 h-24 rounded-full border border-gray-300 object-cover"
                            src={`${process.env.REACT_APP_BASE_URL}/images/company/${job.company?.logo}`}
                            alt="Company Logo"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 mt-4">{job.company?.name}</h3>
                        <p className="text-gray-500">Công ty uy tín - Môi trường làm việc năng động</p>
                    </div>
                </div>
            </div>

            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={job} />
            <Footer />
        </>
    );
};

export default JobDetail;