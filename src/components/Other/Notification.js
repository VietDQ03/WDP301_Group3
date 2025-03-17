import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Circle, Building2, Code2 } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { notificationsApi } from '../../api/notificationsAPI'; 
import { useNavigate } from 'react-router-dom';

const Notification = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationsApi.getById("all", {
          current: 1,
          pageSize: 100
        });

        const formattedNotifications = response?.data?.result.map(notification => ({
          _id: notification._id,
          jobId: notification.jobId._id,
          jobName: notification.jobId.name,
          companyName: notification.companyId.name,
          skills: notification.skillId.map(skill => skill.name),
          isSeen: notification.isSeen,
          isDeleted: notification.isDeleted
        }));

        setNotifications(formattedNotifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await notificationsApi.markAsSeen(notification._id);
      
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === notification._id ? { ...n, isSeen: true } : n
        )
      );
  
      // Assuming you have navigation logic here
      navigate(`/job/${notification.jobId}`);
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const NotificationItem = ({ notification }) => (
    <div 
      onClick={() => handleNotificationClick(notification)}
      className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 transition-colors ${
        !notification.isSeen ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-1">
          {notification.isSeen ? (
            <CheckCircle2 size={16} className="text-green-500" />
          ) : (
            <Circle size={16} className="text-blue-500 fill-current" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-primary hover:text-primary/80">
            {notification.jobName}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Building2 size={14} className="text-gray-500" />
            <span className="text-gray-600">{notification.companyName}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {notification.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 text-sm">
                <Code2 size={14} className="text-gray-500" />
                <span className="text-gray-600">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const unreadCount = notifications.filter(notification => !notification.isSeen).length;

  const NotificationButton = ({ children }) => (
    <Menu.Button className={`relative ${isMobile ? 'flex items-center gap-4' : ''} cursor-pointer hover:bg-white/10 ${isMobile ? 'py-2 px-3' : 'p-2'} rounded-lg transition-colors`}>
      <div className="relative">
        <Bell size={20} />
        {!loading && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      {children}
    </Menu.Button>
  );

  return (
    <li className="relative">
      <Menu>
        {({ open }) => (
          <>
            <NotificationButton>
              {isMobile && <span className="text-lg font-medium">Thông báo</span>}
            </NotificationButton>

            {open && (
              <Menu.Items static className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border divide-y divide-gray-100 z-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.map(notification => (
                    <Menu.Item key={notification._id}>
                      {({ active }) => (
                        <NotificationItem 
                          notification={notification}
                        />
                      )}
                    </Menu.Item>
                  ))
                )}
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </li>
  );
};

export default Notification;