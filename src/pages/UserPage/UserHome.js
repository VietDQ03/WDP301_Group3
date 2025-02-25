import React, { useState, useEffect } from "react";
import "./UserHome.css";
import JobCard from "../../components/UserPage/JobCard";
import CompanyCard from "../../components/UserPage/CompanyCard";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import { Input, Form } from "antd";
import CustomButton from "../../components/Other/CustomButton";

const UserHome = () => {
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce effect for realtime search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchFilters({ name: searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onFinish = (values) => {
    setSearchFilters(values);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    form.setFieldsValue({ name: value });
  };

  return (
    <div>
      <Header />

      <section className="search-section bg-gray-100 py-8">
        <div className="search-content text-center max-w-4xl mx-auto">
          <h2 className="font-bold text-2xl text-gray-800 mb-2">
            Tìm Việc Part-Time Phù Hợp Với Bạn
          </h2>
          <p className="text-gray-600 mb-6">
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu
          </p>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow-md gap-4">
              <Form.Item name="name" className="flex-grow m-0">
                <Input
                  placeholder="Nhập tên việc làm"
                  className="h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </Form.Item>

              <Form.Item className="m-0">
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  className="h-12 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                >
                  Tìm kiếm
                </CustomButton>
              </Form.Item>
            </div>
          </Form>
        </div>
      </section>

      <JobCard filters={searchFilters} />
      <CompanyCard />

      <Footer />
    </div>
  );
};

export default UserHome;