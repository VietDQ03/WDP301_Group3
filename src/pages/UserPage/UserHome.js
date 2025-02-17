import React, { useState } from "react";
import "./HomePage.css"
import JobCard from "../../components/UserP/JobCard";
import CompanyCard from "../../components/UserP/CompanyCard";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import { Input,  Form } from "antd";
import CustomButton from "../../components/CustomButton";

const HomePage = () => {
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({});

  const onFinish = (values) => {
    setSearchFilters(values);
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

export default HomePage;
