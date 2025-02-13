import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"
import JobCard from "../../components/UserP/JobCard";
import CompanyCard from "../../components/UserP/CompanyCard";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import { Table, Input, Button, Space, Form, Typography, Tooltip, Layout, Select, Tag, Modal, message, } from "antd";

const HomePage = () => {
  const [filterTab, setFilterTab] = useState("salary");
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({});

  const renderFilterTabs = () => {
    if (filterTab === "salary") {
      return ["5-10tr", "10-15tr", "15-20tr", "20-25tr", "25-30tr"].map((range, index) => (
        <button
          key={index}
          className="bg-white shadow-md px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          {range}
        </button>
      ));
    } else if (filterTab === "experience") {
      return ["<1 năm", "1-2 năm", "3-5 năm", "5-10 năm", ">10 năm"].map((exp, index) => (
        <button
          key={index}
          className="bg-white shadow-md px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          {exp}
        </button>
      ));
    } else if (filterTab === "industry") {
      return ["Công nghệ", "Kinh doanh", "Marketing", "Y tế", "Xây dựng"].map((industry, index) => (
        <button
          key={index}
          className="bg-white shadow-md px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          {industry}
        </button>
      ));
    }
  };

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
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                >
                  Tìm kiếm
                </Button>
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
