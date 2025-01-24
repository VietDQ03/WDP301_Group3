import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-teal-500 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold tracking-wide">RABOTA - Tìm kiếm việc</h1>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-white hover:text-yellow-300 font-medium transition duration-200"
            >
              Hồ sơ & CV
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-300 font-medium transition duration-200"
            >
              Công cụ
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-300 font-medium transition duration-200"
            >
              Cẩm nang nghề nghiệp
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-300 font-medium transition duration-200 flex items-center"
            >
              TopCV
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-900 bg-yellow-200 rounded">
                Pro
              </span>
            </a>
          </nav>
          <div className="space-x-4">
            {/* Link đến trang Đăng nhập */}
            <Link
              to="/login"
              className="bg-yellow-300 text-green-700 px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-200"
            >
              Đăng nhập
            </Link>
            {/* Link đến trang Đăng ký */}
            <Link
              to="/register"
              className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="search-container my-10">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-3xl mx-auto">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm việc làm..."
                className="flex-grow py-3 px-4 rounded-l-lg border border-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-r-lg hover:bg-green-600 transition duration-300"
              >
                Tìm Kiếm
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="my-10">
        <div className="container mx-auto px-4">
          <img
            src="https://previews.123rf.com/images/garagestock/garagestock1701/garagestock170138628/70143600-job-search-banner.jpg"
            className="w-full h-100"
            alt="Job search banner"
          />
        </div>
      </section>

      <section className="my-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Danh Mục Việc Làm</h2>
          {/* Layout flex cho filter và tab */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter bên trái */}
            <div className="bg-white shadow-md p-4 rounded-lg w-full lg:w-1/4">
              <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setFilterTab("salary")}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${filterTab === "salary" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                      } hover:bg-green-600 hover:text-white transition duration-300`}
                  >
                    Mức lương
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setFilterTab("experience")}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${filterTab === "experience" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                      } hover:bg-green-600 hover:text-white transition duration-300`}
                  >
                    Kinh nghiệm
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setFilterTab("industry")}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${filterTab === "industry" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                      } hover:bg-green-600 hover:text-white transition duration-300`}
                  >
                    Ngành nghề
                  </button>
                </li>
              </ul>
            </div>

            {/* Các tab bên phải */}
            <div className="flex-grow">
              {/* Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {renderFilterTabs()}
              </div>

              {/* Danh sách công việc */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((job) => (
                  <div
                    key={job}
                    className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300"
                  >
                    <h3 className="font-bold text-lg">[Tên Công Việc]</h3>
                    <p className="text-gray-600 mt-2">[Mô tả ngắn gọn]</p>
                    <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600">
                      Xem Chi Tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="my-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Việc Làm Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((job) => (
              <div
                key={job}
                className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300"
              >
                <h3 className="font-bold text-lg">[Tên Công Việc]</h3>
                <p className="text-gray-600 mt-2">[Mô tả ngắn gọn]</p>
                <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600">
                  Xem Chi Tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2025 Tìm Việc Làm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
