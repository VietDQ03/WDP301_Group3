import { jobApi } from "../../api/AdminPageAPI/jobAPI";
import { LOCATION_LIST, getLocationName } from "../../config/ultil";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const JobCard = ({ showPagination = true, filters = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await jobApi.getAll({
        page: params.current || 1,
        pageSize: params.pageSize || 10,
        ...filters, // 🟢 Áp dụng bộ lọc vào API
        ...params,
      });

      const { result, meta } = response.data.data;
      const formattedJobs = result.map((job, index) => ({
        key: job._id,
        stt: index + 1 + (meta.current - 1) * meta.pageSize,
        name: job.name,
        company: {
          name: job.company.name,
          logo: job.company.logo
        },
        location: job.location,
        salary: new Intl.NumberFormat("vi-VN").format(job.salary) + " đ",
        level: job.level,
        quantity: job.quantity,
        status: job.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: new Date(job.createdAt).toLocaleString(),
        updatedAt: new Date(job.updatedAt).toLocaleString(),
      }));

      setJobs(formattedJobs);
      setTotal(meta.total);
      setCurrent(meta.current || 1);
      setPageSize(meta.pageSize || 10);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Có lỗi xảy ra khi tải danh sách công việc!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs({ current, pageSize });
  }, [current, pageSize, filters]); // 🟢 Cập nhật dữ liệu khi filters thay đổi

  const handleOnchangePage = (currentPage, newPageSize) => {
    setCurrent(currentPage);
    setPageSize(newPageSize);
    fetchJobs({ current: currentPage, pageSize: newPageSize });
  };

  const handleViewDetailJob = (item) => {
    navigate(`/job/${item.key}`);
  };

  console.log(jobs)

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <Spin spinning={isLoading} tip="Loading...">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div
              className={`flex justify-between items-center ${isMobile ? "flex-col" : "flex-row"
                }`}
            >
              <span className="text-xl font-bold">Công Việc Mới Nhất</span>
              {!showPagination && (
                <Link to="/job" className="text-blue-500 hover:underline">
                  Xem tất cả
                </Link>
              )}
            </div>
          </Col>

          {jobs?.map((item) => (
            <Col span={24} md={12} key={item.key}>
              <Card size="small" hoverable onClick={() => handleViewDetailJob(item)}>
                <div className="flex gap-4 p-2">
                  <div className="flex-shrink-0">
                    <img
                      alt="company logo"
                      src={`${process.env.REACT_APP_BASE_URL}/images/company/${item?.company?.logo}`}
                      className="w-16 h-16 object-cover rounded-md"
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

          {!jobs?.length && !isLoading && (
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

export default JobCard;
