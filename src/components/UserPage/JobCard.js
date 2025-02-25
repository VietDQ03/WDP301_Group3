import React, { useState, useEffect } from 'react';
import { Card, Col, Empty, Pagination, Row, Spin, message } from 'antd';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
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
        pageSize: 1000, // Fetch a large number to get all items
        ...filters,
      });

      const { result } = response.data;
      // Filter active jobs
      const activeJobs = result.filter(job => job.isActive === true);
      
      const formattedJobs = activeJobs.map((job, index) => ({
        key: job._id,
        stt: index + 1,
        name: job.name,
        company: {
          name: job.company.name,
          logo: job.company.logo
        },
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
  }, [filters]);

  // Get current jobs for pagination
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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <Spin spinning={isLoading} tip="Loading...">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div className={`flex justify-between items-center ${isMobile ? "flex-col" : "flex-row"}`}>
              <span className="text-xl font-bold">Công Việc Mới Nhất</span>
              {!showPagination && (
                <Link to="/job" className="text-blue-500 hover:underline">
                  Xem tất cả
                </Link>
              )}
            </div>
          </Col>

          {currentJobs?.map((item) => (
            <Col span={24} md={12} key={item.key}>
              <Card size="small" hoverable onClick={() => handleViewDetailJob(item)}>
                <div className="flex gap-4 p-2">
                  <div className="flex-shrink-0">
                    <img
                      alt="company logo"
                      src={item?.company?.logo
                        ? `${process.env.REACT_APP_BASE_URL}/images/company/${item.company.logo}`
                        : '/logo.png'
                      }
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = '/logo.png';
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="text-lg font-semibold">{item.name}</div>
                    <div className="text-gray-600 flex items-center">
                      <EnvironmentOutlined className="text-teal-500" />
                      <span className="ml-2">{getLocationName(item.location)}</span>
                    </div>
                    <div className="text-orange-500 flex items-center">
                      <ThunderboltOutlined />
                      <span className="ml-2">
                        {item.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {dayjs(item.updatedAt).fromNow()}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}

          {!currentJobs?.length && !isLoading && (
            <div className="w-full flex justify-center items-center p-6">
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </Row>

        {showPagination && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={current}
              total={allJobs.length}
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

export default JobCard;