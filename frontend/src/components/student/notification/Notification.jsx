import React from 'react';
import { Bell, Calendar, Info } from 'lucide-react';
import './Style-Notification.css';

const Notification = ({exam}) => {
  return (
    <div className="notification">
      <div className="notification-icon">
        <Bell className="bell-icon" />
      </div>
      <div className="notification-content">
        <h2>
          <Calendar className="inline-icon" />
          {exam.examName}
        </h2>
        <p>
          <Info className="inline-icon" />
          {exam?.description ? exam.description : "Vui lòng chọn môn học để xem lịch thi và đăng ký"}
        </p>
      </div>
    </div>
  );
};

export default Notification;