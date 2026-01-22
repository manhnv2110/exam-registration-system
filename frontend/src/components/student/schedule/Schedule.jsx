import './Style-Schedule.css'
import icon_book from '../../../assets/laptop.png'
import { LuCalendar } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { GoDownload } from "react-icons/go";
import { FiPrinter } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Schedule = ({ data, onCancel, onDownload, onPrint }) => {
  return (
    <div className='exam-session-schedule-card'>
      <div className='exam-session-schedule-card-header'>
        <img src={icon_book} alt="" />
        <div className='exam-session-schedule-card-header-title'>
          <span className='exam-session-schedule-card-header-subject-name'>{data.examSession.subjectStatus.subject.name}</span>
          <span className='exam-session-schedule-card-header-subject-code'>{`${data.examSession.subjectStatus.subject.subjectCode}`}</span>
        </div>
      </div>
      <div className='exam-session-schedule-info'>
        <div className='exam-session-schedule-info-item'>
          <LuCalendar className='exam-session-schedule-icon'/>
          <div className='exam-session-schedule-text'>
            <label className='exam-session-schedule-label'>Ngày thi</label>
            <span className='exam-session-schedule-value'>{data.examSession.date}</span>
          </div>
        </div>
        <div className='exam-session-schedule-info-item'>
          <FaRegClock className='exam-session-schedule-icon'/>
          <div className='exam-session-schedule-text'>
            <label className='exam-session-schedule-label'>Giờ thi</label>
            <span className='exam-session-schedule-value'>{data.examSession.startTime}</span>
          </div>
        </div>
        <div className='exam-session-schedule-info-item'>
          <GrLocation className='exam-session-schedule-icon-location'/>
          <div className='exam-session-schedule-text'>
            <label className='exam-session-schedule-label'>Địa điểm thi</label>
            <span className='exam-session-schedule-value'>{`${data.examSession.room.name} - ${data.examSession.room.location.name}`}</span>
          </div>
        </div>
      </div>
      <div className='exam-session-schedule-action-buttons'>
        <button className='exam-session-schedule-button exam-session-schedule-download' onClick={() => onDownload(data)}>
          <GoDownload size={21}/>
          Tải phiếu
        </button>
        <button className='exam-session-schedule-button exam-session-schedule-print' onClick={() => onPrint(data)}>
          <FiPrinter size={21}/>
          In phiếu
        </button>
        <button className='exam-session-schedule-button exam-session-schedule-remove' onClick={() => {
          const confirmCancel = window.confirm("Xác nhận hủy đăng kí ca thi này")
          if (confirmCancel) {
            onCancel(data.id)
          }
        }}>
          <IoMdCloseCircleOutline size={21}/>
          Hủy đăng ký
        </button>
      </div>
    </div>
  )
}

export default Schedule