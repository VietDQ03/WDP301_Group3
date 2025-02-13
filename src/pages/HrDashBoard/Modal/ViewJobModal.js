import React from 'react';
import { Dialog } from '@headlessui/react';
import { 
  MapPin,
  Building2, 
  Users,
  Calendar,
  Briefcase,
  BanknoteIcon,
  Code,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ViewJobModal = ({ isOpen, onClose, jobData }) => {
  if (!jobData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  const DescriptionItem = ({ icon: Icon, label, value, isTag = false }) => (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-gray-600 text-sm mb-1 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      {isTag ? (
        <div className="mt-1">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {value === "ACTIVE" ? "Đang tuyển" : "Đã đóng"}
          </span>
        </div>
      ) : (
        <div className="text-gray-900 font-medium">{value}</div>
      )}
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded-xl bg-gray-50 p-6 max-h-[90vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Chi tiết công việc
            </Dialog.Title>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{jobData.name}</h3>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-5 h-5 mr-2" />
                  {jobData.company.name}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DescriptionItem 
                  icon={Code}
                  label="Kỹ năng"
                  value={jobData.skills.join(", ")}
                />
                <DescriptionItem 
                  icon={MapPin}
                  label="Địa điểm"
                  value={jobData.location}
                />
                <DescriptionItem 
                  icon={BanknoteIcon}
                  label="Mức lương"
                  value={formatSalary(jobData.salary)}
                />
                <DescriptionItem 
                  icon={Users}
                  label="Số lượng"
                  value={jobData.quantity}
                />
                <DescriptionItem 
                  icon={Briefcase}
                  label="Cấp bậc"
                  value={jobData.level}
                />
                <DescriptionItem 
                  icon={CheckCircle2}
                  label="Trạng thái"
                  value={jobData.status}
                  isTag={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DescriptionItem 
                  icon={Calendar}
                  label="Ngày bắt đầu"
                  value={formatDate(jobData.startDate)}
                />
                <DescriptionItem 
                  icon={Calendar}
                  label="Ngày kết thúc"
                  value={formatDate(jobData.endDate)}
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Mô tả công việc</h3>
                </div>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: jobData.description }}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ViewJobModal;