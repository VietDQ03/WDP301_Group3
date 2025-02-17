import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Card } from "antd";
import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { EnvironmentOutlined } from "@ant-design/icons";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            try {
                const response = await companyApi.findOne(id);
                setCompany(response);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết công ty:", error);
                message.error("Không tìm thấy công ty!");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyDetail();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin tip="Đang tải..." />
            </div>
        );
    }

    if (!company) {
        return <div className="text-center text-red-500">Không tìm thấy công ty!</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex justify-center items-center bg-gray-100 p-6">
                <Card className="w-full p-6 bg-white shadow-lg rounded-lg">
                    {/* Logo + Tên công ty */}
                    <div className="flex flex-col items-center">
                        <img
                            src={`${process.env.REACT_APP_BASE_URL}/images/company/${company?.logo}`}
                            alt={company.name}
                            className="w-32 h-32 object-cover rounded-full shadow-md"
                        />
                        <h2 className="text-2xl font-semibold mt-4 text-gray-800">{company.name}</h2>
                    </div>

                    {/* Địa chỉ công ty */}
                    <div className="flex items-center justify-center mt-4 text-gray-600">
                        <EnvironmentOutlined style={{ color: "#58aaab" }} className="text-lg" />
                        <span className="ml-2">{company?.address}</span>
                    </div>

                    {/* Mô tả công ty */}
                    <div className="mt-6 text-gray-700 text-justify leading-relaxed border-t pt-4">
                        <p
                            className="text-gray-600 text-center mt-2"
                            dangerouslySetInnerHTML={{ __html: company.description || "Chưa có mô tả." }}
                        />
                    </div>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default CompanyDetail;
