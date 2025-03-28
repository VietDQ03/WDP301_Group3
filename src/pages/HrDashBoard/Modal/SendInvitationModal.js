import React, { useState } from 'react';
import { Modal, Select, Button, message, Space } from 'antd';
import { Mail, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { sendInvitation } from '../../../api/authAPI';

const SendInvitationModal = ({ isOpen, onClose, jobs, userId }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!selectedJob) {
      message.warning('Vui lòng chọn công việc');
      return;
    }
  
    setLoading(true);
    try {
      const response = await sendInvitation({
        userId: userId,
        jobId: selectedJob
      });
      
      message.success('Gửi thư mời thành công');
      setSelectedJob(null);
      onClose();
    } catch (error) {
      console.error('Send invitation error:', error);
      message.error('Có lỗi xảy ra khi gửi thư mời');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('vi-VN').format(salary) + ' đ';
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-blue-600">
          <Mail className="w-5 h-5" />
          <span>Gửi thư mời tuyển dụng</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Gửi thư mời
        </Button>
      ]}
    >
      <div className="space-y-4 py-4">
        <div>
          <label className="text-gray-700 font-medium mb-2 block">
            Chọn công việc
          </label>
          <Select
            placeholder="Chọn công việc muốn gửi thư mời"
            className="w-full"
            value={selectedJob}
            onChange={setSelectedJob}
            optionLabelProp="label"
          >
            {jobs.map(job => (
              <Select.Option 
                key={job.key} 
                value={job.key}
                label={job.name}
              >
                <div className="space-y-2 py-2">
                  <div className="font-medium text-gray-800">{job.name}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location === 'HANOI' ? 'Hà Nội' :
                       job.location === 'HOCHIMINH' ? 'Hồ Chí Minh' :
                       job.location === 'DANANG' ? 'Đà Nẵng' : 'Khác'}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.level === 'FULLTIME' ? 'Toàn thời gian' :
                       job.level === 'PARTTIME' ? 'Bán thời gian' : 'Khác'}
                    </span>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default SendInvitationModal;