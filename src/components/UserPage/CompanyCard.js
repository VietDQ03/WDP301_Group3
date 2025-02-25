import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { Card, Col, Empty, Pagination, Row, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';

const CompanyCard = ({ showPagination = true }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [allCompanies, setAllCompanies] = useState([]); // Lưu trữ tất cả companies
    const [displayedCompanies, setDisplayedCompanies] = useState([]); // Companies được hiện thị theo trang

    const navigate = useNavigate();

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await companyApi.getAll({ pageSize: 1000 }); // Lấy số lượng lớn để đảm bảo lấy hết

            if (response?.data) {
                const { result } = response.data;
                // Lọc các công ty active
                const activeCompanies = result
                    .filter(company => company.isActive)
                    .map((item, index) => ({
                        ...item,
                        key: item._id,
                        stt: index + 1
                    }));

                setAllCompanies(activeCompanies);
                
                // Phân trang cho lần hiển thị đầu tiên
                const firstPageCompanies = activeCompanies.slice(0, pageSize);
                setDisplayedCompanies(firstPageCompanies);
            }
        } catch (error) {
            message.error('Không thể tải danh sách công ty');
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Xử lý phân trang
    const handleOnchangePage = (currentPage, newPageSize) => {
        setCurrent(currentPage);
        setPageSize(newPageSize);
        
        // Tính toán start và end index cho trang hiện tại
        const startIndex = (currentPage - 1) * newPageSize;
        const endIndex = startIndex + newPageSize;
        
        // Cập nhật companies được hiển thị
        const newDisplayedCompanies = allCompanies.slice(startIndex, endIndex);
        setDisplayedCompanies(newDisplayedCompanies);
    };

    const handleViewDetailCompany = (item) => {
        navigate(`/companies/${item._id}`);
    };

    return (
        <div className="p-8 bg-gray-100 rounded-lg shadow-md">
            <Spin spinning={isLoading} tip="Loading...">
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <div className={`flex justify-between items-center ${isMobile ? 'flex-col' : 'flex-row'}`}>
                            <span className="text-xl font-bold">Nhà Tuyển Dụng Hàng Đầu</span>
                            {!showPagination && <Link to="company" className="text-blue-500 hover:underline">Xem tất cả</Link>}
                        </div>
                    </Col>

                    {displayedCompanies.map(item => (
                        <Col span={24} md={6} key={item._id}>
                            <Card size="small" hoverable onClick={() => handleViewDetailCompany(item)}>
                                <div className="flex flex-col items-center p-2">
                                    <img
                                        alt="company logo"
                                        src={item?.logo
                                            ? `${process.env.REACT_APP_BASE_URL}/images/company/${item.logo}`
                                            : '/logo.png'
                                        }
                                        className="w-20 h-20 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.src = '/logo.png';
                                        }}
                                    />
                                    <div className="text-lg font-semibold mt-2">{item.name}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}

                    {!displayedCompanies?.length && !isLoading && (
                        <div className="w-full flex justify-center items-center p-6">
                            <Empty description="Không có dữ liệu" />
                        </div>
                    )}
                </Row>

                {showPagination && allCompanies.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={current}
                            total={allCompanies.length}
                            pageSize={pageSize}
                            responsive
                            onChange={handleOnchangePage}
                        />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default CompanyCard;