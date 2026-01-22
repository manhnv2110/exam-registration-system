import { useState } from 'react'
import { motion } from 'framer-motion' 
import './Style-ResetPassword.css'
import { useAuth } from '../../../hooks/useAuth'
import Spinner from '../../student/spinner/Spinner'
import { LuKeyRound } from "react-icons/lu";

const ResetPassword = ({ token }) => {

  const { resetPassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới'
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (password.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setLoading(true)
      await resetPassword(token, password)
      setLoading(false)
      
      if (window.confirm("Đặt lại mật khẩu thành công. Đăng nhập ngay?")) {
          window.location.href = '/login'
      } else {
          window.location.href = '/login'
      }
      
    } catch (error) {
      setLoading(false)
      console.error(error)
      setErrors({ server: "Đã có lỗi xảy ra hoặc đường dẫn hết hạn." })
    }
  }

  return (
    <div className='reset-password-overlay'>
      <motion.div 
        className='reset-password-card'
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Icon Header */}
        <div className="reset-password-icon-wrapper">
          <LuKeyRound className='reset-password-key-icon'/>
        </div>

        <h2 className='reset-password-title'>Đặt lại mật khẩu</h2>
        <p className='reset-password-subtitle'>Tạo mật khẩu mới để bảo vệ tài khoản của bạn.</p>

        <form className='reset-password-form' onSubmit={handleSubmitResetPassword}>
            <div className='reset-password-input-group'>
                <label>Mật khẩu mới</label>
                <input 
                  type="password" 
                  placeholder="Tối thiểu 8 ký tự..."
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors({...errors, password: ''})
                  }}
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && <span className='reset-password-error-text'>{errors.password}</span>}
            </div>

            {/* Input Xác nhận mật khẩu */}
            <div className='reset-password-input-group'>
                <label>Xác nhận lại mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrors({...errors, confirmPassword: ''})
                  }}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && <span className='reset-password-error-text'>{errors.confirmPassword}</span>}
            </div>
          
            {errors.server && <div className='reset-server-error'>{errors.server}</div>}

            <button type='submit' className='reset-password-btn-submit' disabled={loading}>
                {loading ? <Spinner/> : "Xác nhận thay đổi"}
            </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ResetPassword