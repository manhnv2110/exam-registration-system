import './Style-Login.css'
import logo_university from '../../assets/logo_uet.webp'
import { useEffect, useState, useContext } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useExam } from '../../hooks/useExam'
import ForgotPassword from '../../components/login/forgotpassword/ForgotPassword'
import { useSearchParams } from 'react-router-dom'
import ResetPassword from '../../components/login/resetpassword/ResetPassword'
import Spinner from '../../components/student/spinner/Spinner'
import ChangePasswordFirstTime from '../../components/login/changepasswordfirsttime/ChangePasswordFirstTime'
import MyContext from '../../context/MyContext'
import { useNavigate} from 'react-router-dom';


const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth() 
  const { getExamIsOpen } = useExam()
  const navigate = useNavigate();

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [showChangePasswordFirstTime, setShowChangePasswordFirstTime] = useState(false)
  const { user } = useContext(MyContext)

  useEffect(() => {
    if (token) {
      setResetPassword(true)
    }
  }, [token])
  

  const handleFocusPassword = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.querySelector('input[type="password"]').focus()
    }
  }

  const handleSubmitLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const loginUser = await login(email, password)

      setLoading(false)

      if (loginUser.role === "STUDENT") {
        if (loginUser.firstLogin) {
          setShowChangePasswordFirstTime(true)  
          return
        }
        await getExamIsOpen()
        navigate("/student/home")
      }

      if (loginUser.role === "ADMIN") {
        navigate("/admin/exam-management")
      }

    } catch (err) {
      setLoading(false)
      console.error("Login failed", err)
      setShowError(err.message)
    }
  }

  return (
    <div className='login-page'>
      <div className={`login ${(forgotPassword || resetPassword || loading) ? 'blur': ''}`}>
        <div className='left-panel'>
          <img src={logo_university} alt="" />
          <span>Hệ thống đăng kí dự thi</span>
          <span>Trường đại học công nghệ</span>
        </div>
        <div className='right-panel'>
          <form className='login-form' onSubmit={handleSubmitLogin}>
            <h1>Đăng nhập</h1>
            <div>
              <label>Email</label>
              <input 
                type="text" 
                placeholder='Nhập email' 
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleFocusPassword}
              />
            </div>
            <div className='password-login'>
              <label>Mật khẩu</label>
              <input 
                type="password" 
                placeholder='Nhập mật khẩu' 
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className={`invalid ${showError ? 'show': ''}`}>
                {/* Email hoặc mật khẩu không đúng. Vui lòng thử lại. */}
                {showError}
              </p>
            </div>
            <p className='forgot-password'>
              <span onClick={() => setForgotPassword(true)}>Quên mật khẩu</span>
            </p>
            <button type='submit'></button>
          </form>
        </div>
      </div>
      {
        forgotPassword && (
          <ForgotPassword 
            isForgotPassword={forgotPassword}
            onCloseForgotPassword={() => setForgotPassword(false)}
          />
        )
      }
      {
        resetPassword && (
          <ResetPassword
            token={token}
            isResetPassword={resetPassword}
            onCloseResetPassword={setResetPassword}
          />
        )
      }
      {
        loading && (
          <div className='login-page-spinner'>
            <Spinner/>
          </div>
        )
      }
      {
        showChangePasswordFirstTime && (
          <ChangePasswordFirstTime onClose={() => setShowChangePasswordFirstTime(false)} />
        )
      }
    </div>
  )
}

export default Login
