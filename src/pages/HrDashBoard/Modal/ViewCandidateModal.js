import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const ViewCandidateModal = ({ isOpen, onClose, cvData }) => {
  if (!cvData) return null;

  const handleDownload = () => {
    window.open(`${process.env.REACT_APP_API_URL}/uploads/${cvData.url}`, '_blank');
  };

  return (
    <Modal
      title="Chi tiết CV"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="download" type="primary" onClick={handleDownload} icon={<FileTextOutlined />}>
          Tải xuống CV
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Thông tin cơ bản</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">CV ID:</span>
              <span className="ml-2 font-medium">#{cvData.key.slice(-6)}</span>
            </div>
            <div>
              <span className="text-gray-500">User ID:</span>
              <span className="ml-2 font-medium">#{cvData.userId.slice(-6)}</span>
            </div>
            <div>
              <span className="text-gray-500">Trạng thái:</span>
              <Tag color={cvData.status === "ACTIVE" ? "green" : "red"} className="ml-2">
                {cvData.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </div>
            <div>
              <span className="text-gray-500">Kinh nghiệm:</span>
              <Tag color="orange" className="ml-2">
                {cvData.experience ? `${cvData.experience} năm` : 'Chưa có kinh nghiệm'}
              </Tag>
            </div>
            <div>
              <span className="text-gray-500">Tên file:</span>
              <span className="ml-2 font-medium">{cvData.url}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Thông tin chi tiết</h3>
          <div className="mt-2 space-y-3">
            <div>
              <span className="text-gray-500">Vị trí ứng tuyển:</span>
              <div className="mt-1">
                {cvData.position.split(',').map((pos, index) => (
                  <Tag key={index} color="purple" className="mr-2 mb-2">
                    {pos.trim()}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Kỹ năng:</span>
              <div className="mt-1">
                {cvData.skill.split(',').map((skill, index) => (
                  <Tag key={index} color="blue" className="mr-2 mb-2">
                    {skill.trim()}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Thời gian</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Ngày tạo:</span>
              <span className="ml-2">{cvData.createdAt}</span>
            </div>
            <div>
              <span className="text-gray-500">Cập nhật lần cuối:</span>
              <span className="ml-2">{cvData.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ViewCandidateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cvData: PropTypes.shape({
    key: PropTypes.string,
    userId: PropTypes.string,
    status: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    url: PropTypes.string,
    position: PropTypes.string,
    skill: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })
};

export default ViewCandidateModal;