import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAppliedJobs } from "../../api/UserApi/UserApi";
import { Link } from "react-router-dom";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";

const JobHistory = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppliedJobs();
    }
  }, [isAuthenticated]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await getAppliedJobs();
      if (res.data) {
        console.log("Dữ liệu API:", res.data); // Kiểm tra dữ liệu trả về từ API
        setAppliedJobs(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách job đã apply:", error);
    }
  };

  return (
    <>
      <Header />
      <div
        className="container mx-auto px-6 py-12 flex flex-col items-center"
        style={{ minHeight: "61vh" }}
      >
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Việc làm đã ứng tuyển
          </h1>

          {!isAuthenticated ? (
            <p className="text-lg text-red-500 text-center">
              Bạn cần đăng nhập để xem lịch sử ứng tuyển.
            </p>
          ) : appliedJobs.length === 0 ? (
            <p className="text-lg text-gray-600 text-center">
              Bạn chưa ứng tuyển công việc nào.
            </p>
          ) : (
            <ul className="space-y-6">
              {appliedJobs.map((job) => (
                <li
                  key={job._id}
                  className="flex items-start border p-5 rounded-lg shadow-md bg-gray-50"
                >
                  {/* Job Details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {job?.jobId?.name}
                    </h2>
                    <p className="text-sm text-gray-700 font-medium">
                      {job?.companyName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Thời gian ứng tuyển:{" "}
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-500 mt-1">
                      CV đã ứng tuyển:{" "}
                      <Link to={job.cvLink} className="underline">
                        CV tải lên
                      </Link>
                    </p>
                    <p className="text-sm mt-1">
                      Hồ sơ{" "}
                      <span
                        className={
                          job?.status === "PENDING"
                            ? "text-orange-500 font-bold"
                            : job?.status === "APPROVED"
                            ? "text-green-500 font-bold"
                            : "text-red-500 font-bold"
                        }
                      >
                        {job?.status === "PENDING"
                          ? "đang chờ"
                          : job?.status === "APPROVED"
                          ? "phù hợp"
                          : "chưa phù hợp"}
                      </span>
                    </p>
                  </div>
                  {/* Job Actions */}
                  <div className="flex flex-col items-end ml-4">
                    <p className="text-lg font-bold text-green-600 mb-2">
                      {job?.jobId?.salary || "Thỏa thuận"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/job/${job?.jobId?._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                      >
                        Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobHistory;