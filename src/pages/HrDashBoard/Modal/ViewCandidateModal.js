import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { FileText, User, Activity, Award, File, Briefcase, Code, FileText as Description } from 'lucide-react';

const ViewCandidateModal = ({ isOpen, onClose, cvData }) => {
  if (!cvData) return null;

  const handleDownload = () => {
    window.open(`${process.env.REACT_APP_API_URL}/uploads/${cvData.url}`, '_blank');
  };

  const modalStyle = {
    top: '50px',
    margin: '0 auto',
    padding: '0',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-blue-600">
          <FileText className="w-5 h-5" />
          <span>Chi tiết CV</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      className="custom-modal"
      style={modalStyle}
      bodyStyle={{ padding: '16px' }}
      footer={[
        <Button 
          key="download" 
          type="primary" 
          onClick={handleDownload} 
          className="bg-blue-500 hover:bg-blue-600"
          icon={<FileText className="w-4 h-4" />}
        >
          Tải xuống CV
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      <div className="space-y-4">
        {/* Thông tin cơ bản */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-500" />
            <span>Thông tin cơ bản</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-gray-500 min-w-[100px]">Họ và tên:</span>
              <span className="font-medium text-gray-700">{cvData.user_id.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 min-w-[100px]">Trạng thái:</span>
              <Tag 
                color={cvData.isActive ? "success" : "error"} 
                className="flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                {cvData.isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 min-w-[100px]">Kinh nghiệm:</span>
              <Tag color="orange" className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {cvData.experience_original.name}
              </Tag>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 min-w-[100px]">Tên file:</span>
              <span className="font-medium text-gray-700 flex items-center gap-1">
                <File className="w-4 h-4 text-gray-400" />
                {cvData.url}
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <span>Thông tin chi tiết</span>
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500 block mb-2">Vị trí ứng tuyển:</span>
              <div className="flex flex-wrap gap-2">
                {cvData.position_original.map((pos, index) => (
                  <Tag 
                    key={index} 
                    color="purple" 
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <Briefcase className="w-3 h-3" />
                    {pos.name}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-500 block mb-2">Kỹ năng:</span>
              <div className="flex flex-wrap gap-2">
                {cvData.skill_original.map((skill, index) => (
                  <Tag 
                    key={index} 
                    color="blue" 
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <Code className="w-3 h-3" />
                    {skill.name}
                  </Tag>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 block mb-2 flex items-center gap-2">
                <Description className="w-4 h-4" />
                Mô tả:
              </span>
              <div className="bg-white p-3 rounded border border-gray-200">
                {cvData.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{cvData.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Không có mô tả</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewCandidateModal;