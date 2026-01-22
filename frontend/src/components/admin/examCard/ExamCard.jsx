import { CiCalendar } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoLockOpenOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import "./Style-ExamCard.css"

const ExamCard = ({ exam, onViewDetail, onAddSubject, onEdit, onClose, onOpen, onDelete }) => {

  const navigate = useNavigate();
  
  const handleViewClick = () => {
    navigate(`/admin/exam-management/exam-info/${exam.id}`)
  }

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action(exam);
  };

  return (
    <div className={`exam-management-card ${exam.status}`} onClick={handleViewClick}>
      {/* Exam Header */}
      <div className="exam-management-card-header">
        <div>
          <h2 className="exam-management-card-title">{exam.name}</h2>
          <div className="exam-management-card-date">
            <CiCalendar className="exam-management-date-icon" />
            <span>{exam.startDate} - {exam.endDate}</span>
          </div>
        </div>
        <span className={`exam-management-status ${exam.status}`}>
          {exam.status === 'active' ? 'Đang mở' : exam.status === 'upcoming' ? 'Sắp mở' : 'Đã đóng'}
        </span>
      </div>

      {/* Statistics */}
      <div className="exam-management-stats">
        <div className="stat-management-card stat-card-subjects">
          <span className="stat-card-label">Số môn thi</span>
          <span className="stat-card-value">{exam.totalSubjects}</span>
        </div>
        <div className="stat-management-card stat-card-sessions">
          <span className="stat-card-label">Số ca thi</span>
          <span className="stat-card-value">{exam.totalSessions}</span>
        </div>
        <div className="stat-management-card stat-card-registrations">
          <span className="stat-card-label">Lượt đăng ký</span>
          <span className="stat-card-value">{exam.totalRegistrations}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="exam-management-actions">
        {/* <button 
          className="exam-mangement-btn-action exam-management-btn-view"
          onClick={(e) => {
            e.stopPropagation();
            handleViewClick();
          }}
        >
          <IoEyeOutline className="exam-management-action-icon" />
          <span>Xem chi tiết</span>
        </button> */}
        <button 
          className="exam-mangement-btn-action exam-management-btn-add"
          onClick={(e) => handleButtonClick(e, onAddSubject)}
        >
          <IoMdAdd className="exam-management-action-icon" />
          <span>Thêm môn thi</span>
        </button>
        <button 
          className="exam-mangement-btn-action exam-management-btn-edit"
          onClick={(e) => handleButtonClick(e, onEdit)}
        >
          <MdEdit className="exam-management-action-icon" />
          <span>Chỉnh sửa</span>
        </button>
        <button 
          className={`exam-mangement-btn-action ${
            exam.status === 'active' 
              ? 'exam-management-btn-close' 
              : 'exam-management-btn-open'
          }`}
          onClick={(e) => 
            exam.status === 'active'
              ? handleButtonClick(e, onClose)
              : handleButtonClick(e, onOpen)
          }
        >
          {exam.status === 'active' ? (
            <>
              <IoLockClosedOutline className="exam-management-action-icon"/>
              <span>Đóng kỳ thi</span>
            </>
          ) : (
            <>
              <IoLockOpenOutline className="exam-management-action-icon"/>
              <span>Mở kỳ thi</span>
            </>
          )}
        </button>
        <button 
          className="exam-mangement-btn-action exam-management-btn-delete"
          onClick={(e) => handleButtonClick(e, onDelete)}
        >
          <FaRegTrashAlt className="exam-management-action-icon"/>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default ExamCard;