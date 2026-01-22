import './Style-SelectedExamSession.css'
import { MdOutlineChangeCircle } from "react-icons/md"
import logo_exam_session from '../../../assets/logo_exam_session.png'

const SelectExamSession = ({setStep, examSession}) => {
  return (
    <div className="selected-exam-session">
      <div className='selected-exam-session-title'>
        <img src={logo_exam_session} alt="" />
        <span>Ca thi</span>
      </div>
      <p className='selected-exam-session-name'>{`Ngày ${examSession.date}`}</p>
      <p>{`Thời gian thi: ${examSession.startTime}`}</p>
      <p>{`Phòng thi: ${examSession.room.name}`}</p>
      <div className='change-session' onClick={() => setStep(2)}>
        <MdOutlineChangeCircle/>
        <span>Thay đổi ca thi</span>
      </div>
    </div>
  )
}

export default SelectExamSession