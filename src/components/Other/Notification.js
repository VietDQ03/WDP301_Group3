import React from 'react';
import { Bell } from 'lucide-react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';

const Notification = ({ isMobile = false }) => {
  const navigate = useNavigate();
  // Mock notification count - replace with actual data from your backend
  const notificationCount = 3;

  const notificationItems = [
    {
      key: '1',
      label: 'Công việc phù hợp mới',
      onClick: () => navigate('/notifications/jobs')
    },
    {
      key: '2',
      label: 'Trạng thái ứng tuyển đã cập nhật',
      onClick: () => navigate('/notifications/applications')
    },
    {
      key: '3',
      label: 'Xem tất cả thông báo',
      onClick: () => navigate('/notifications')
    }
  ];

  if (isMobile) {
    return (
      <li>
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 py-2 px-3 rounded-lg transition-colors">
            <div className="relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <span className="text-lg font-medium">Thông báo</span>
          </div>
        </Dropdown>
      </li>
    );
  }

  return (
    <li>
      <Dropdown
        menu={{ items: notificationItems }}
        placement="bottomRight"
        trigger={['click']}
      >
        <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      </Dropdown>
    </li>
  );
};

export default Notification;