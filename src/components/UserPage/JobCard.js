import React, { useState, useEffect } from 'react';
import { Card, Col, Empty, Pagination, Row, Spin, message } from 'antd';
import { MapPin, Zap, Calendar, Users, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { isMobile } from 'react-device-detect';
import { jobApi } from '../../api/AdminPageAPI/jobAPI';
import { getLocationName } from '../../config/ultil';

dayjs.extend(relativeTime);

const JobCard = ({ showPagination = true, filters = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [allJobs, setAllJobs] = useState([]);
  const navigate = useNavigate();

  const fetchAllJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobApi.getAll({
        page: 1,
        pageSize: 1000,
        ...filters,
      });

      const { result } = response.data;
      const activeJobs = result.filter(job => 
        job.isActive === true && 
        job.quantity > 0
      );

      const formattedJobs = activeJobs.map((job, index) => ({
        key: job._id,
        stt: index + 1,
        name: job.name,
        company: {
          name: job.company.name,
          logo: job.company.logo
        },
        skills: job.skills || [],
        location: job.location,
        salary: new Intl.NumberFormat("vi-VN").format(job.salary),
        level: job.level,
        quantity: job.quantity,
        status: job.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: new Date(job.createdAt).toLocaleString(),
        updatedAt: new Date(job.updatedAt).toLocaleString(),
      }));

      setAllJobs(formattedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Có lỗi xảy ra khi tải danh sách công việc!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();

    const intervalId = setInterval(() => {
      fetchAllJobs();
    }, 120000);

    return () => clearInterval(intervalId);
  }, [filters]);

  const getCurrentJobs = () => {
    const indexOfLastJob = current * pageSize;
    const indexOfFirstJob = indexOfLastJob - pageSize;
    return allJobs.slice(indexOfFirstJob, indexOfLastJob);
  };

  const handleOnchangePage = (currentPage, newPageSize) => {
    setCurrent(currentPage);
    setPageSize(newPageSize);
  };

  const handleViewDetailJob = (item) => {
    navigate(`/job/${item.key}`);
  };

  const currentJobs = getCurrentJobs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div className={`flex justify-between items-center mb-6 ${isMobile ? "flex-col gap-4" : "flex-row"}`}>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Công Việc Mới Nhất</h1>
                  <p className="text-gray-500 mt-1">Khám phá cơ hội nghề nghiệp hấp dẫn</p>
                </div>
                {!showPagination && (
                  <Link 
                    to="/job" 
                    className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group"
                  >
                    <span>Xem tất cả</span>
                    <svg 
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </Col>

            {currentJobs?.map((item) => (
              <Col span={24} md={12} key={item.key}>
                <Card 
                  className="group h-full transition-all duration-300 hover:shadow-lg border-gray-200 overflow-hidden rounded-xl"
                  bodyStyle={{ padding: 0 }}
                  hoverable 
                  onClick={() => handleViewDetailJob(item)}
                >
                  <div className="p-6">
                    <div className="flex gap-5">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center p-2 group-hover:border-blue-200 transition-colors">
                          <img
                            alt={`${item.company.name} logo`}
                            src={item?.company?.logo
                              ? `${process.env.REACT_APP_BASE_URL}/images/company/${item.company.logo}`
                              : '/logo.png'
                            }
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/logo.png';
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {item.company.name}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                            <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{getLocationName(item.location)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                            <Users className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{item.quantity} vị trí</span>
                          </div>
                          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                            <Zap className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{item.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</span>
                          </div>
                          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                            <Clock className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{dayjs(item.updatedAt).fromNow()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {item.skills?.map((skill) => (
                            <span
                              key={skill._id}
                              className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>

                        <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 group-hover:bg-green-100 transition-colors">
                            {item.level}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" strokeWidth={2} />
                            {dayjs(item.updatedAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}

            {!currentJobs?.length && !isLoading && (
              <Col span={24}>
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
                  <Empty 
                    description={
                      <span className="text-gray-500">Không có việc làm phù hợp</span>
                    }
                  />
                  <p className="mt-4 text-gray-600">Vui lòng thử lại với các bộ lọc khác</p>
                </div>
              </Col>
            )}
          </Row>

          {showPagination && allJobs.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={current}
                total={allJobs.length}
                pageSize={pageSize}
                responsive
                onChange={handleOnchangePage}
                className="hover:text-blue-600"
              />
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JobCard;