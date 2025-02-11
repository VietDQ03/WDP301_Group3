import { companyApi } from "../../api/AdminPageAPI/companyApi";
import { convertSlug } from '../../config/ultil';
import { Card, Col, Empty, Pagination, Row, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';

const CompanyCard = ({ showPagination = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [companies, setCompanies] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const navigate = useNavigate();

    const fetchCompanies = async (params = {}) => {
        try {
            setIsLoading(true);
            const response = await companyApi.getAll({
                page: params.current || 1,
                pageSize: params.pageSize || 10,
                ...params
            });

            const { result, meta } = response.data.data;

            if (!Array.isArray(result)) {
                console.warn("API returned an unexpected result:", result);
                setCompanies([]);
                return;
            }

            setCompanies(result);
            setPagination({
                ...pagination,
                total: meta.total,
                current: meta.current || 1,
                pageSize: meta.pageSize || 10,
            });
        } catch (error) {
            console.error("Error fetching companies:", error);
            message.error("Có lỗi xảy ra khi tải danh sách công ty!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies({ current, pageSize });
    }, []);

    const handleOnchangePage = (currentPage, newPageSize) => {
        if (currentPage !== current) {
            setCurrent(currentPage);
        }
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
            setCurrent(1);
        }
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

                    {companies?.map(item => (
                        <Col span={24} md={6} key={item._id}>
                            <Card size="small" hoverable onClick={() => handleViewDetailCompany(item)}>
                                <div className="flex flex-col items-center p-2">
                                    <img
                                        alt="company logo"
                                        src={`http://localhost:8000/images/company/${item?.logo}`}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="text-lg font-semibold mt-2">{item.name}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}

                    {!companies?.length && !isLoading && (
                        <div className="w-full flex justify-center items-center p-6">
                            <Empty description="Không có dữ liệu" />
                        </div>
                    )}
                </Row>

                {showPagination && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={current}
                            total={total}
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