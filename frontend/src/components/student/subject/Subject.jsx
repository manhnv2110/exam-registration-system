import './Style-Subject.css'
import logo_subject from '../../../assets/logo_subject.png'
import logo_register from '../../../assets/logo_register.png'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import MyContext from '../../../context/MyContext'
// Import thêm icon CloseCircle
import { IoMdCheckboxOutline, IoMdAddCircleOutline, IoMdCloseCircle } from "react-icons/io"

const Subject = ({data}) => {
  const navigate = useNavigate()
  const {setSelectedSubject} = useContext(MyContext)

  const handleSelectSubject = () => {
    setSelectedSubject(data.subject)
    localStorage.setItem("selectedSubject", JSON.stringify(data.subject))
    navigate(`/student/register/${data.subject.id}`)
  }

  const isEligible = data.status === 'ELIGIBLE';

  return (
    <div className={`subject-card-student  ${!isEligible ? 'subject-ineligible' : ''}`}>
      
      {/* HEADER */}
      <div className='subject-card-student-title'>
        <img src={logo_subject} alt="logo" />
        <span className='subject-card-student-name'>{data.subject.name}</span>
      </div>

      {/* BODY */}
      <div className='subject-card-student-info'>
        <div className='subject-card-student-sub-info'>
          <span>Số tín chỉ:</span>
          <span>{data.subject.creditHour}</span>
        </div>
        <div className='subject-card-student-sub-info'>
          <span>Mã HP:</span>
          <span>{data.subject.subjectCode}</span>
        </div>
        <div className='subject-card-student-sub-info'>
          <span>Thời lượng thi:</span>
          <span>{`${data.subject.duration} phút`}</span>
        </div>
        <div className='subject-card-student-sub-info'>
          <span>Trạng thái:</span>
          <span className={`subject-card-student-status-badge ${isEligible ? 'status-eligible' : 'status-ineligible'}`}>
            {isEligible ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
          </span>
        </div>
      </div>

      <div className='subject-card-student-action-area'>
        {
          data.registered ? (
            <div className='subject-card-student-btn-registered'>
              <IoMdCheckboxOutline size={22}/>
              <span>Đã đăng ký</span>
            </div>
          ) : !isEligible ? (
             <button className='subject-card-student-btn-disabled' disabled>
                <span>Không thể đăng ký</span>
             </button>
          ) : (
            <button className='subject-card-student-btn-register' onClick={handleSelectSubject}>
              <img src={logo_register}/>
              <span>Đăng ký thi</span>
            </button>
          )
        }
      </div>
    </div>
  )
}

export default Subject;