import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Card } from "antd";
import { MapPin, Mail, Globe, Phone, Building2, Users, Calendar } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { companyApi } from "../../api/AdminPageAPI/companyApi";

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
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Spin tip="Đang tải..." size="large" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-xl font-semibold text-red-500">Không tìm thấy công ty!</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Company Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
                        <div className="absolute -bottom-16 left-8">
                            <div className="p-2 bg-white rounded-2xl shadow-lg">
                                <img
                                    src={company?.logo
                                        ? `${process.env.REACT_APP_BASE_URL}/images/company/${company.logo}`
                                        : '/logo.png'
                                    }
                                    alt={company?.name}
                                    className="w-32 h-32 object-contain rounded-xl"
                                    onError={(e) => {
                                        e.target.src = '/logo.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                        <div className="mt-4 flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                            <span>{company.address}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu công ty</h2>
                                <div 
                                    className="prose max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: company.description || "Chưa có mô tả." }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Building2 className="w-5 h-5 text-blue-500 mr-3" />
                                        <span>Công ty {company.name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-5 h-5 text-green-500 mr-3" />
                                        <span>{company.address}</span>
                                    </div>
                                    {company.email && (
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-5 h-5 text-red-500 mr-3" />
                                            <span>{company.email}</span>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="w-5 h-5 text-purple-500 mr-3" />
                                            <span>{company.phone}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center text-gray-600">
                                            <Globe className="w-5 h-5 text-orange-500 mr-3" />
                                            <a 
                                                href={company.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CompanyDetail;