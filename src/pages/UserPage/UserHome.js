import React, { useState, useEffect } from "react";
import "./UserHome.css";
import JobCard from "../../components/UserPage/JobCard";
import CompanyCard from "../../components/UserPage/CompanyCard";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import { Input, Form, Select } from "antd";
import { skillApi } from "../../api/skillAPI";

const { Option } = Select;

const UserHome = () => {
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState(undefined);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(undefined);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillApi.getAll({
        current: 1,
        pageSize: 100,
      });

      if (response?.data?.result) {
        setSkills(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

 
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters = {};
      
      if (searchTerm) {
        newFilters.name = searchTerm.trim();
      }
      
      if (location) {
        newFilters.location = location;
      }

      if (selectedSkill) {
        const selectedSkillObj = skills.find(skill => skill._id === selectedSkill);
        if (selectedSkillObj) {
          newFilters.skills = selectedSkillObj.name; // Gửi tên skill
        }
      }

      console.log('Setting new filters:', newFilters); // Debug log
      setSearchFilters(newFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, location, selectedSkill, skills]);

  // Thêm log để debug
  useEffect(() => {
    console.log('searchFilters changed:', searchFilters);
  }, [searchFilters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    form.setFieldsValue({ name: value });
  };

  const handleLocationChange = (value) => {
    setLocation(value);
    form.setFieldsValue({ location: value });
  };

  const handleSkillChange = (value) => {
    setSelectedSkill(value);
    form.setFieldsValue({ skill: value });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(243, 244, 246)' }}>
      <Header />

      <div className="container mx-auto bg-white">
        <section className="search-section bg-gray-100 py-8">
          <div className="search-content text-center max-w-4xl mx-auto">
            <h2 className="font-bold text-2xl text-gray-800 mb-2">
              Tìm Việc Part-Time Phù Hợp Với Bạn
            </h2>
            <p className="text-gray-600 mb-6">
              Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu
            </p>

            <Form form={form} layout="vertical">
              <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow-md gap-4">
                <Form.Item name="name" className="flex-grow m-0">
                  <Input
                    placeholder="Nhập tên việc làm"
                    className="h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                    onChange={handleSearchChange}
                    value={searchTerm}
                  />
                </Form.Item>

                <div className="md:w-40">
                  <Form.Item name="location" className="mb-0">
                    <Select
                      placeholder="Chọn địa điểm"
                      className="h-12 rounded-lg"
                      allowClear
                      onChange={handleLocationChange}
                      value={location}
                      style={{ 
                        height: '48px',
                        borderRadius: '0.5rem'
                      }}
                    >    
                      <Option value="HANOI">Hà Nội</Option>
                      <Option value="HOCHIMINH">Hồ Chí Minh</Option>
                      <Option value="DANANG">Đà Nẵng</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="md:w-48">
                  <Form.Item name="skill" className="mb-0">
                    <Select
                      placeholder="Chọn kỹ năng"
                      className="h-12 rounded-lg"
                      allowClear
                      onChange={handleSkillChange}
                      value={selectedSkill}
                      style={{ 
                        height: '48px',
                        borderRadius: '0.5rem'
                      }}
                    >
                      {skills.map(skill => (
                        <Option key={skill._id} value={skill._id}>
                          {skill.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </section>

        <JobCard filters={searchFilters} />
        <CompanyCard />
      </div>

      <Footer />
    </div>
  );
};

export default UserHome;