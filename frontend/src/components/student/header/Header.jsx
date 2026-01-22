import './Style-Header.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md"
import { MdAppRegistration } from "react-icons/md";
import { useContext } from 'react'
import MyContext from '../../../context/MyContext'
import logo_university from '../../../assets/logo_university.png'
import logo_schedule from '../../../assets/calendar.png'
import logo_registration from "../../../assets/registration.png"
import logo_account from "../../../assets/account.png"

const Header = () => {

  const { user } = useContext(MyContext)

  const navigate = useNavigate()
  const location = useLocation()

  const showExamSchedule = location.pathname === '/student/exam-schedule'

  return (
    <div className='header-student-screen'>
      <div className='header-student-screen-left'>
        <div className='hl1'>
          <img src={logo_university} alt="" className='logo_uni' onClick={() => navigate('/student/home')}/>
        </div>
        <div className='hl2'>
          <p className='logo-text-name' onClick={() => navigate('/student/home')}>UET Exam</p>
          <span className='student-name-and-code'>{`${user.fullname} - ${user.studentCode}`}</span>
        </div>
      </div>

      <div className='header-student-screen-right'>
        {
          showExamSchedule ? (
            <button className='header-button registration-button' onClick={() => navigate('/student/home')}>
              <img src={logo_registration} className='button-icon-registration'/>
              <span>Đăng ký thi</span>
            </button>
          ) : (
            <button className='header-button schedule-button' onClick={() => navigate('/student/exam-schedule')}>
              <img src={logo_schedule} alt="" className='button-icon-schedule'/>
              <span>Xem lịch thi</span>
            </button>
          )
        }
        <img src={logo_account} className='account-icon' onClick={() => navigate('/student/student-account')}/>
      </div>
    </div>
  )
}

export default Header;