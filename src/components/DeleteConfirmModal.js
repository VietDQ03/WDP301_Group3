import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title || "Xác nhận xóa"}
          </h3>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600">
            {content || "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;