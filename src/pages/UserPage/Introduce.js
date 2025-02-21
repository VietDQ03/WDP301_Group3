import { Link } from "react-router-dom";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import CustomButton from "../../components/Other/CustomButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClockCircleOutlined, CrownOutlined, CustomerServiceOutlined, AppstoreOutlined } from "@ant-design/icons";
import LoginModal from "../../components/UserP/LoginModal";

const Introduce = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handlePostJobClick = () => {
        if (user?.role?.name === "HR_ROLE") {
            navigate("/dashboard/job");
        } else {
            setModalMessage("Bạn không có quyền đăng tuyển công việc. Vui lòng sử dụng tài khoản HR để có thể đăng tuyển.");
            setShowModal(true);
        }
    };

    return (
        <div>
            <Header />

            <div className="flex flex-col md:flex-row items-center justify-center px-64 py-10 md:py-16 bg-white">
                {/* Phần văn bản */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="relative text-2xl md:text-3xl font-bold text-black leading-tight 
                before:absolute before:-top-2
                before:w-32 before:h-2 before:bg-blue-300 before:content-['']">
                        Nền tảng kết nối doanh nghiệp với 10 triệu ứng viên tiềm năng
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Tuyển người dễ dàng với RabotaWorks.com - Chúng tôi luôn có ứng viên phù hợp cho bạn
                    </p>
                    <CustomButton
                        onClick={handlePostJobClick}
                        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-md">
                        Đăng tin ngay !
                    </CustomButton>
                </div>

                {/* Phần hình ảnh */}
                <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <img
                        src="/banner1.png"
                        alt="Kết nối ứng viên"
                        className="max-w-full md:max-w-lg"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center md:px-16 py-10 bg-white">
                {/* Tiêu đề chính */}
                <h2 className="relative text-xl md:text-2xl font-semibold italic text-center mb-6
                before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 
                before:w-40 before:h-2 before:bg-blue-700 before:content-['']">
                    RabotaWorks.com - website nền tảng tìm việc làm part-time cho sinh viên.
                </h2>

                {/* Danh sách lợi ích */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    {/* Nguồn ứng viên chất lượng */}
                    <div className="flex items-start space-x-4">
                        <ClockCircleOutlined className="text-3xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Nguồn ứng viên chất lượng</h3>
                            <p>
                                Nhà tuyển dụng dễ dàng tiếp cận hơn <strong>10 triệu hồ sơ</strong> cùng <strong>50 triệu lượt truy cập</strong> mỗi năm, đảm bảo nguồn ứng viên phong phú và phù hợp.
                            </p>
                        </div>
                    </div>

                    {/* Trải nghiệm toàn diện */}
                    <div className="flex items-start space-x-4">
                        <CrownOutlined className="text-3xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Trải nghiệm toàn diện</h3>
                            <p>
                                Tài khoản nhà tuyển dụng tích hợp các tính năng thông minh, giúp quản lý tin tuyển dụng, hồ sơ ứng viên và theo dõi lượt nộp đơn một cách thuận tiện.
                            </p>
                        </div>
                    </div>

                    {/* Chi phí hợp lý */}
                    <div className="flex items-start space-x-4">
                        <AppstoreOutlined className="text-3xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Chi phí hợp lý</h3>
                            <p>
                                Nhà tuyển dụng được hưởng đặc quyền <strong>12+ tin đăng miễn phí</strong> mỗi năm, tối ưu ngân sách và nâng cao hiệu quả tuyển dụng.
                            </p>
                        </div>
                    </div>

                    {/* Chất lượng CSKH chuyên nghiệp */}
                    <div className="flex items-start space-x-4">
                        <CustomerServiceOutlined className="text-3xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Chất lượng CSKH chuyên nghiệp</h3>
                            <p>
                                Đội ngũ CSKH chuyên biệt của RobotaWorks.com luôn tận tâm hỗ trợ, mang đến trải nghiệm tốt nhất và hiệu quả cao nhất cho nhà tuyển dụng.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nút CTA */}
                <p className="mt-8 text-lg font-semibold italic text-center">
                    Trải nghiệm dịch vụ đăng tin tại RobotaWorks.com
                </p>
                <CustomButton
                    onClick={handlePostJobClick}
                    type="primary" size="large" className="mt-4 bg-green-600 border-none w-[700px]">
                    Đăng tin ngay!
                </CustomButton>
            </div>
            <div class="bg-white px-60 py-10 rounded-lg shadow-md">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="md:w-1/3 flex justify-center">
                        <img src="/friends.png" alt="Mô tả hình ảnh" class="max-w-[300px] md:max-w-[400px] object-contain"></img>
                    </div>
                    <div class="md:w-2/3 text-center md:text-left">
                        <p class="italic text-3xl font-bold text-gray-700">
                            Phiên bản 2025 giúp đăng tuyển nhanh chóng <br></br>
                            <span class="block text-center">và hiệu quả hơn</span>
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div class="p-4 border border-gray-300 rounded-lg shadow-sm">
                        <p class="font-semibold text-blue-600 flex items-center">
                            <span class="mr-2">📅</span> Quản lý đăng tuyển
                        </p>
                        <p class="text-gray-700">
                            Với thư viện hơn 1000+ mô tả công việc chuẩn, nhà tuyển dụng dễ dàng tìm kiếm gợi ý phù hợp cho mọi ngành nghề và vị trí.
                        </p>
                    </div>
                    <div class="p-4 border border-gray-300 rounded-lg shadow-sm">
                        <p class="font-semibold text-blue-600 flex items-center">
                            <span class="mr-2">📂</span> Quản lý ứng viên
                        </p>
                        <p class="text-gray-700">
                            Với công cụ quản lý tích hợp, giao diện trực quan, dễ sử dụng, nhà tuyển dụng có thể theo dõi và quản lý kho hồ sơ ứng viên hiệu quả theo từng vị trí đăng tuyển.
                        </p>
                    </div>
                    <div class="p-4 border border-gray-300 rounded-lg shadow-sm">
                        <p class="font-semibold text-blue-600 flex items-center">
                            <span class="mr-2">📢</span> Quảng cáo đa nền tảng
                        </p>
                        <p class="text-gray-700">
                            Tin tuyển dụng được ưu tiên hiển thị đầu trang kết quả tìm kiếm và mở rộng tiếp cận qua các kênh truyền thông như Facebook.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
            <LoginModal
                isModalOpen={showModal}
                setIsModalOpen={setShowModal}
                modalMessage={modalMessage}
            />
        </div>
    );
};

export default Introduce;