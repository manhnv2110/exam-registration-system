import './Style-Sidebar.css';
import { TbReportAnalytics } from "react-icons/tb";
import { LuGraduationCap } from "react-icons/lu";
import { FaSwatchbook, FaBook, FaClipboardList } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'exam', icon: <TbReportAnalytics size={24}/>, label: 'Quản lý kỳ thi', path: '/admin/exam-management'},
    { id: 'student', icon: <LuGraduationCap size={24}/>, label: 'Quản lý học sinh', path: '/admin/student-management'},
    { id: 'course', icon: <FaSwatchbook size={21}/>, label: 'Quản lý học phần', path: '/admin/course-management'},
    { id: 'eligibility', icon: <FaClipboardList size={21}/>, label: 'Quản lý điều kiện dự thi', path: '/admin/exam-eligibility' },
    { id: 'report', icon: <MdAssessment size={24}/>, label: 'Báo cáo', path: '/admin/report' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          );
        })
      }
      </nav>
    </div>
  );
};

export default Sidebar;