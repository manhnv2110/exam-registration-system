import { useState } from 'react'
import { motion } from 'framer-motion' // Thêm hiệu ứng
import './Style-ForgotPassword.css'
import { useAuth } from '../../../hooks/useAuth'
import Spinner from '../../student/spinner/Spinner'
import { MdOutlineMail } from "react-icons/md";

const ForgotPassword = ({ onCloseForgotPassword }) => {

  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault()
    
    setNotice('')
    setSuccess(false)

    if (!email.trim()) {
      setNotice("Vui lòng nhập địa chỉ email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        setNotice("Định dạng email không hợp lệ")
        return
    }

    try {
      setLoading(true)
      await forgotPassword(email)
      setLoading(false)
      setNotice("Đường dẫn khôi phục đã được gửi vào email!")
      setSuccess(true)
    } catch (error) {
      setLoading(false)
      setNotice(error.message || "Có lỗi xảy ra, vui lòng thử lại")
      setSuccess(false)
      console.error(error)
    }
  }

  return (
    <div className='forgot-password-overlay' onClick={onCloseForgotPassword}>
      <motion.div 
        className='forgot-password-card'
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="forgot-password-icon-wrapper">
          <MdOutlineMail className='forgot-password-mail-icon'/>
        </div>

        <h2 className='forgot-password-title'>Quên mật khẩu?</h2>
        <p className='forgot-password-subtitle'>Hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
        
        <form className='forgot-password-form' onSubmit={handleSubmitForgotPassword}>
          <div className='forgot-password-input-group'>
            <label>Email đăng ký</label>
            <input 
              type="text"
              placeholder='example@vnu.edu.vn'
              value={email}
              onChange={(e) => {
                  setEmail(e.target.value)
                  setNotice('') // Xóa lỗi khi người dùng gõ
              }}
              className={notice && !success ? 'input-error' : ''}
              disabled={loading} 
            />
            {/* Hiển thị thông báo ngay dưới input */}
            {notice && (
                <div className={`forgot-password-notice-message ${success ? 'forgot-password-success-msg' : 'forgot-password-error-msg'}`}>
                    {success ? (
                        <span>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="forgot-password-msg-icon"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                           {notice}
                        </span>
                    ) : (
                        <span>{notice}</span>
                    )}
                </div>
            )}
          </div>

          <button type='submit' className='fp-submit-btn' disabled={loading}>
            {loading ? <Spinner/> : "Gửi yêu cầu"}
          </button>
          
          <div className='fp-footer'>
            <span className='forgot-password-back-link' onClick={() => onCloseForgotPassword(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="forgot-password-arrow-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Quay lại đăng nhập
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ForgotPassword