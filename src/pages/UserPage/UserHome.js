import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"
import JobCard from "../../components/UserP/JobCard";
import CompanyCard from "../../components/UserP/CompanyCard";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";

const HomePage = () => {
  const [filterTab, setFilterTab] = useState("salary");

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

  return (
    <div>
      <Header />

      <section className="search-section">
        <div className="search-content">
          <h2 className="font-bold">Tìm Việc Part-Time Phù Hợp Với Bạn</h2>
          <p>Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu</p>
          <div className="search-box">
            <input type="text" id="jobSearch" placeholder="Nhập tên công việc..." />
            <input type="text" id="locationSearch" placeholder="Địa điểm..." />
            <button id="searchBtn"><i className="fas fa-search"></i> Tìm Kiếm</button>
          </div>
        </div>
      </section>

      <JobCard />
      <CompanyCard />

      <Footer />
    </div>
  );
};

export default HomePage;
