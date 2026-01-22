import { use, useContext, useState } from 'react';
import Header from '../../../components/student/header/Header';
import './Style-StudentAccount.css'
import { IoIosLogOut } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { MdChangeCircle } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, color } from 'framer-motion';
import MyContext from '../../../context/MyContext';
import { useAuth } from '../../../hooks/useAuth';
import { useStudent } from '../../../hooks/useStudent';

const StudentAccount = () => {

  const { user, setUser } = useContext(MyContext)
  const { changePasswordFirstTime, logout } = useAuth()
  const { changePassword } = useStudent()

  const navigate = useNavigate()

  const tabs = [
    {key: "info", label: "Thông tin cá nhân", icon: <MdAccountCircle/>},
    {key: "password", label: "Đổi mật khẩu", icon: <MdChangeCircle/>}
  ]

  const [tabContent, setTabContent] = useState('info')
  const [showChangePasswordFirstTime, setShowChangePasswordFirstTime] = useState(user.firstLogin)

  const handleSelectTab = (tabKey) => {
    setTabContent(tabKey)
  }

  const handleFocusChangePassword = (e, classname) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.querySelector(classname).focus()
    }
  }

  const handleCancel = () => {
    document.querySelector('.present-password').value = ''
    document.querySelector('.new-password').value = ''
    document.querySelector('.confirm-new-password').value = ''
  }

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [errorsChangePassword, setErrorsChangePassword] = useState({})

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng điền mật khẩu hiện tại'
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng điền mật khẩu mới'
    }
    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Vui lòng xác nhật mật khẩu'
    } else if (confirmNewPassword.trim() !== newPassword.trim()) {
      newErrors.confirmNewPassword = 'Mật khẩu không khớp'
    }

    setErrorsChangePassword(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }
    try {
      await changePassword(currentPassword, newPassword)
      window.alert('Đổi mật khẩu thành công')
    } catch(error) {
      const backendErrors = {}
      if (error.message === 'Current password is incorrect') {
        backendErrors.currentPassword = 'Mật khẩu hiện tại không đúng'
      }
      if (error.message === 'newPassword: Password must be at least 8 characters') {
        backendErrors.newPassword = 'Mât khẩu mới phải có ít nhất 8 kí tự'
      }
      setErrorsChangePassword(backendErrors)
    }
  }

  const [passwordFt, setPasswordFt] = useState('')
  const [confirmPasswordFt, setConfirmPasswordFt] = useState('')
  const [errorPasswordFt, setErrorPasswordFt] = useState(false)
  const [errorConfirmFt, setErrorConfirmFt] = useState(false)
  const [errorMissMatch, setErrorMissMatch] = useState(false)

  const handleChangePasswordFirstTime = async (e) => {
    e.preventDefault()
    setErrorsChangePassword({})
    if (!passwordFt.trim()) {
      setErrorPasswordFt(true)
      return
    }
    if (!confirmPasswordFt.trim()) {
      setErrorConfirmFt(true)
      setErrorMissMatch(false)
      return
    }
    if (passwordFt !== confirmPasswordFt) {
      setErrorMissMatch(true)
      setErrorConfirmFt(false)
      return
    } else {
      setErrorPasswordFt(false)
      setErrorMissMatch(false)
      setErrorConfirmFt(false)
    }
    try {
      await changePasswordFirstTime(confirmPasswordFt)
      const updateUser = {...user, firstLogin: false}
      setUser(updateUser)
      localStorage.setItem('user', JSON.stringify(updateUser))
      setShowChangePasswordFirstTime(false)
    } catch (error) {
      console.error("Change password failed", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      throw error
    }
  }

  return (
    <AnimatePresence mode='wait'>
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
    <div className={`page-account ${showChangePasswordFirstTime ? 'blr' : ''}`}>
      <Header/>
      <div className='student-account'>
        <div className='account-tabs'>
          <div className='tab-top'>
            {
              tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={`tab-item ${tabContent === tab.key ? 'student-account-active' : ''}`}
                  onClick={() => handleSelectTab(tab.key)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {
                    tabContent === tab.key && (
                      <motion.div
                        layoutId='tab-border'
                        className='tab-border'
                        transition={{type: "spring", stiffness: 1000, damping: 50}}
                      />
                    )
                  }
                </div>
              ))
            }
          </div>
          <div className='tab-logout' onClick={() => {
            const confirmLogout = window.confirm("Sau khi đăng xuất, 20 phút sau sẽ được đăng nhập lại")
            if (confirmLogout) {
              handleLogout()
            }
          }}>
            <IoIosLogOut/>
            <span>Đăng xuất</span>
          </div>
        </div>
        {
          tabContent === 'info' &&
          <div className='tab-info-content info'>
            <div>
              <label>Họ và tên:</label>
              <span>{user.fullname}</span>
            </div>
            <div>
              <label>Mã sinh viên:</label>
              <span>{user.studentCode}</span>
            </div>
            <div>
              <label>Ngày sinh:</label>
              <span>{user.dob}</span>
            </div>
            <div>
              <label>Giới tính:</label>
              <span>{`${user.gender === 'MALE' ? 'Nam' : 'Nữ'}`}</span>
            </div>
            <div>
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div>
              <label>Số điện thoại:</label>
              <span>{user.phone}</span>
            </div>
            <div>
              <label>Lớp:</label>
              <span>{user.className}</span>
            </div>
            <div>
              <label>Ngành học:</label>
              <span>{user.major}</span>
            </div>
            <div>
              <label>Khoa:</label>
              <span>{user.faculty}</span>
            </div>
          </div>
        }
        {
          tabContent === 'password' &&
          <div className='tab-change-password-content password'>
            <form className='change-password-form' onSubmit={handleSubmitChangePassword}>
              <div className='change-password-form-group'>
                <label className='change-password-from-label'>Mật khẩu hiện tại</label>
                <input 
                  className='change-password-input present-password' 
                  type="password" 
                  placeholder='Nhập mật khẩu hiện tại'
                  onKeyDown={(e) => handleFocusChangePassword(e, '.new-password')}
                  name='currentPassword'
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                {
                  errorsChangePassword.currentPassword &&
                  <p>{errorsChangePassword.currentPassword}</p>
                }
              </div>
              <div className='change-password-form-group'>
                <label className='change-password-from-label'>Mật khẩu mới</label>
                <input 
                  className='change-password-input new-password' 
                  type="password" 
                  placeholder='Nhập mật khẩu mới'
                  onKeyDown={(e) => handleFocusChangePassword(e, '.confirm-new-password')}
                  name='newPassword'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                {
                  errorsChangePassword.newPassword &&
                  <p>{errorsChangePassword.newPassword}</p>
                }
              </div>    
              <div className='change-password-form-group'>
                <label className='change-password-from-label'>Xác nhận mật khẩu mới</label>
                <input 
                  className='change-password-input confirm-new-password' 
                  type="password" 
                  placeholder='Xác nhận mật khẩu mới'
                  onKeyDown={(e) => handleFocusChangePassword(e, '.btn-change')}
                  name='confirmNewPassword'
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                />
                {
                  errorsChangePassword.confirmNewPassword &&
                  <p>{errorsChangePassword.confirmNewPassword}</p>
                }
              </div>
              
              <div className='form-actions'>
                <button className='btn-change' type='submit'>Đổi mật khẩu</button>
                <button type='button' className='btn-cancel' onClick={handleCancel}>Hủy</button>
              </div>
              <ul>
                <li>
                  <FaCheck/>
                  <span>Sử dụng ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</span>
                </li>
                <li>
                  <FaCheck/>
                  <span>Không sử dụng thông tin cá nhât dễ đoán (tên, ngày sinh, số điện thoại)</span>
                </li>
                <li>
                  <FaCheck/>
                  <span>Không sử dụng mật khẩu giống với tài khoản khác</span>
                </li>
                <li>
                  <FaCheck/>
                  <span>Thay đổi mật khẩu định kỳ 3-6 tháng/lần</span>
                </li>
              </ul>
            </form>
          </div>
        }
      </div>
    </div>
    {/* {
      showChangePasswordFirstTime && 
      <form 
        className='change-password-first-time' 
        onSubmit={handleChangePasswordFirstTime}
      >
        <p>
          Bạn đang đăng nhập lần đầu.<br />
          Vui lòng đổi mật khẩu để đảm bảo an toàn.
        </p>
        <div>
          <span>Mật khẩu mới :</span>
          <input 
            type="password" 
            name='passwordFt'
            value={passwordFt}
            onChange={(e) => setPasswordFt(e.target.value)}
          />
          {
            errorPasswordFt && 
            <p>Vui lòng nhập mật khẩu mới</p>
          }
        </div>
        <div>
          <span>Xác nhận mật khẩu :</span>
          <input 
            type="password" 
            name='passwordFt'
            value={confirmPasswordFt}
            onChange={(e) => setConfirmPasswordFt(e.target.value)}
          />
          {
            errorConfirmFt && 
            <p>Vui lòng xác nhận lại mật khẩu</p>
          }
          {
            errorMissMatch &&
            <p>Mật khẩu không khớp</p>
          }
        </div>
        <button type='submit'>Xác nhận</button>
      </form>
    } */}
    </motion.div>
    </AnimatePresence>
  )
}

export default StudentAccount