import './Style-ExamSession.css'
import logo_tick from '../../../assets/logo_tick.png'

const ExamSession = ({data, isSelected, onSelect}) => {
  return (
    <div 
      className={`exam-session ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <h5 className='exam-session-date'>{`Ngày thi ${data.date}`}</h5>
      <div className='session-info'>
        <span>Giờ thi:</span>
        <span>{data.startTime}</span>
      </div>
      <div className='session-info'>
        <span>Phòng thi:</span>
        <span>{data.room.name}</span>
      </div>
      <div className='session-info'>
        <span>Số lượng:</span>
        <span>{`${data.registeredCount}/${data.capacity}`}</span>
      </div>
      <div className='session-info'>
        <span>Trạng thái:</span>
        <span className={`status ${data.status === "AVAILABLE" ? 'available' : "full"}`}>
          {data.status === 'AVAILABLE' ? 'Còn chỗ': 'Hết chỗ'}
        </span>
      </div>
      <img src={logo_tick} alt="" className={`${isSelected ? "ticked" : ''}`}/>
    </div>
  )
}

export default ExamSession;