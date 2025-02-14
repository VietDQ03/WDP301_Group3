import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, content }) => {
  return (
    <Modal
      title={title || "Xác nhận xóa"}
      open={isOpen}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
        style: {
          backgroundColor: '#ff4d4f',
          borderColor: '#ff4d4f',
        }
      }}
      centered
      maskClosable={false}
    >
      <div className="flex items-center gap-2">
        <ExclamationCircleOutlined className="text-red-500 text-xl" />
        <p>{content || "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."}</p>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;