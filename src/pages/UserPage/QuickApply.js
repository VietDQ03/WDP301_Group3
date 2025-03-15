import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Search, Eye } from "lucide-react";
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";
import { cvAPI } from "../../api/cvAPI";
import { positionApi } from "../../api/positionAPI";
import { skillApi } from "../../api/skillAPI";
import { experienceApi } from "../../api/experienceAPI";
import { callUploadSingleFile } from "../../api/UserApi/UserApi";
import { useSelector } from "react-redux";

const QuickApply = () => {
    const { user } = useSelector((state) => state.auth);
    const [urlCV, setUrlCV] = useState("");
    const [cvId, setCvId] = useState(null);
    const [formData, setFormData] = useState({
        position_ids: [],
        skill_ids: [],
        experience_id: "",
        description: "",
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Data states
    const [positions, setPositions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);

    // Search states
    const [searchPosition, setSearchPosition] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [searchExperience, setSearchExperience] = useState("");

    // Dropdown states
    const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
    const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.position-dropdown-container')) {
                setIsPositionDropdownOpen(false);
            }
            if (!event.target.closest('.skill-dropdown-container')) {
                setIsSkillDropdownOpen(false);
            }
            if (!event.target.closest('.experience-dropdown-container')) {
                setIsExperienceDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [positionsRes, skillsRes, experiencesRes] = await Promise.all([
                    positionApi.getAll({ current: 1, pageSize: 100 }),
                    skillApi.getAll({ current: 1, pageSize: 100 }),
                    experienceApi.getAll({ current: 1, pageSize: 100 })
                ]);

                setPositions(positionsRes.data.result || []);
                setSkills(skillsRes.data.result || []);
                setExperiences(experiencesRes.data.result || []);

                if (user?._id) {
                    const cvDataArray = await cvAPI.findAllByUserId(user._id);
                    console.log("CV Data Array:", cvDataArray);

                    if (cvDataArray?.[0]) {
                        const cvData = cvDataArray[0];
                        console.log("Setting CV Data:", cvData);
                        
                        setCvId(cvData._id);
                        setFormData({
                            position_ids: cvData.position || [],
                            skill_ids: cvData.skill || [],
                            experience_id: cvData.experience || "",
                            description: cvData.description || "",
                            isActive: typeof cvData.isActive === 'boolean' ? cvData.isActive : true
                        });

                        setUrlCV(cvData.url || "");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Không thể tải dữ liệu");
            }
        };

        fetchData();
    }, [user?._id]);

    const filteredPositions = positions.filter(position =>
        position.name.toLowerCase().includes(searchPosition.toLowerCase())
    );

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchSkill.toLowerCase())
    );

    const filteredExperiences = experiences.filter(experience =>
        experience.name.toLowerCase().includes(searchExperience.toLowerCase())
    );

    const handlePositionSelect = (positionId) => {
        setFormData(prev => {
            const newPositionIds = prev.position_ids.includes(positionId)
                ? prev.position_ids.filter(id => id !== positionId)
                : [...prev.position_ids, positionId];
            return {
                ...prev,
                position_ids: newPositionIds
            };
        });
        setIsPositionDropdownOpen(false);
        setSearchPosition("");
    };

    const handleSkillSelect = (skillId) => {
        setFormData(prev => {
            const newSkillIds = prev.skill_ids.includes(skillId)
                ? prev.skill_ids.filter(id => id !== skillId)
                : [...prev.skill_ids, skillId];
            return {
                ...prev,
                skill_ids: newSkillIds
            };
        });
        setIsSkillDropdownOpen(false);
        setSearchSkill("");
    };

    const handleExperienceSelect = (experienceId) => {
        setFormData(prev => ({
            ...prev,
            experience_id: experienceId
        }));
        setIsExperienceDropdownOpen(false);
        setSearchExperience("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.url);
                alert(`${file.name} tải lên thành công`);
            } else {
                setUrlCV("");
                throw new Error(res.message || 'Tải lên thất bại');
            }
        } catch (error) {
            alert(error.message || 'Đã có lỗi xảy ra khi tải lên file');
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const cvData = {
                position: formData.position_ids,
                skill: formData.skill_ids,
                experience: formData.experience_id,
                description: formData.description,
                url: urlCV,
                isActive: formData.isActive
            };

            let response;
            if (cvId) {
                // Nếu đã có CV thì update
                response = await cvAPI.update(cvId, cvData);
            } else {
                // Nếu chưa có CV thì create
                response = await cvAPI.create(cvData);
                setCvId(response.data._id); // Lưu ID của CV mới tạo
            }
            
            alert("Lưu hồ sơ thành công!");
        } catch (error) {
            setError(error.message || "Đã có lỗi xảy ra khi lưu hồ sơ!");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async () => {
        try {
            setLoading(true);
            setError("");

            if (!urlCV && !formData.isActive) {
                alert("Vui lòng tải lên CV trước khi bật ứng tuyển");
                return;
            }

            const newActiveState = !formData.isActive;
            const cvData = {
                position: formData.position_ids,
                skill: formData.skill_ids,
                experience: formData.experience_id,
                description: formData.description,
                url: urlCV,
                isActive: newActiveState
            };

            let response;
            if (cvId) {
                response = await cvAPI.update(cvId, cvData);
            } else {
                response = await cvAPI.create(cvData);
                setCvId(response.data._id);
            }

            setFormData(prev => ({
                ...prev,
                isActive: newActiveState
            }));

            alert(newActiveState ? "Đã bật ứng tuyển" : "Đã tắt ứng tuyển");
        } catch (error) {
            setError(error.message || "Đã có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Ứng Tuyển Nhanh</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tải lên CV
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <Upload className="w-5 h-5 mr-2" />
                                        <span>Chọn File</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {urlCV && (
                                        <div className="flex items-center space-x-4">
                                            <span 
                                                className="text-sm text-gray-600 max-w-[150px] truncate"
                                                title={urlCV.split('/').pop()}
                                            >
                                                {urlCV.split('/').pop()}
                                            </span>
                                            <a
                                                href={`${process.env.REACT_APP_BASE_URL}/images/resume/${urlCV}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                                title="Xem CV"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative position-dropdown-container">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vị trí ứng tuyển
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tìm kiếm vị trí..."
                                        value={searchPosition}
                                        onChange={(e) => setSearchPosition(e.target.value)}
                                        onFocus={() => setIsPositionDropdownOpen(true)}
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                                {formData.position_ids.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formData.position_ids.map(positionId => {
                                            const position = positions.find(p => p._id === positionId);
                                            return position && (
                                                <span
                                                    key={position._id}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {position.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {isPositionDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredPositions.length > 0 ? (
                                            filteredPositions.map((position) => (
                                                <div
                                                    key={position._id}
                                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.position_ids.includes(position._id) ? 'bg-blue-50' : ''}`}
                                                    onClick={() => handlePositionSelect(position._id)}
                                                >
                                                    {position.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                Không tìm thấy vị trí
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative skill-dropdown-container">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kỹ năng
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tìm kiếm kỹ năng..."
                                        value={searchSkill}
                                        onChange={(e) => setSearchSkill(e.target.value)}
                                        onFocus={() => setIsSkillDropdownOpen(true)}
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                                {formData.skill_ids.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formData.skill_ids.map(skillId => {
                                            const skill = skills.find(s => s._id === skillId);
                                            return skill && (
                                                <span
                                                    key={skill._id}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {skill.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {isSkillDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredSkills.length > 0 ? (
                                            filteredSkills.map((skill) => (
                                                <div
                                                    key={skill._id}
                                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skill_ids.includes(skill._id) ? 'bg-blue-50' : ''}`}
                                                    onClick={() => handleSkillSelect(skill._id)}
                                                >
                                                    {skill.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                Không tìm thấy kỹ năng
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative experience-dropdown-container">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kinh nghiệm
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tìm kiếm kinh nghiệm..."
                                        value={searchExperience}
                                        onChange={(e) => setSearchExperience(e.target.value)}
                                        onFocus={() => setIsExperienceDropdownOpen(true)}
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                                {formData.experience_id && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {experiences.find(e => e._id === formData.experience_id)?.name}
                                        </span>
                                    </div>
                                )}

                                {isExperienceDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredExperiences.length > 0 ? (
                                            filteredExperiences.map((experience) => (
                                                <div
                                                    key={experience._id}
                                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.experience_id === experience._id ? 'bg-blue-50' : ''}`}
                                                    onClick={() => handleExperienceSelect(experience._id)}
                                                >
                                                    {experience.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                Không tìm thấy kinh nghiệm
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {loading ? 'Đang xử lý...' : 'Lưu hồ sơ'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleToggleActive}
                                    disabled={loading}
                                    className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                                        loading ? 'bg-gray-400 cursor-not-allowed'
                                            : formData.isActive ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {loading ? 'Đang xử lý...'
                                        : formData.isActive ? 'Tắt ứng tuyển'
                                            : 'Bật ứng tuyển'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default QuickApply;