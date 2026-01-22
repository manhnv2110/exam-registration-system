import { useState, useContext } from "react"
import { useAuth } from "../../../hooks/useAuth"
import MyContext from "../../../context/MyContext"
import { motion } from "framer-motion" 
import { GoLock } from "react-icons/go";
import "./Style_ChangePasswordFirstTime.css"

const ChangePasswordFirstTime = ({ onClose }) => {
  const { user, setUser } = useContext(MyContext)
  const { changePasswordFirstTime } = useAuth()

  const [passwordFt, setPasswordFt] = useState("")
  const [confirmPasswordFt, setConfirmPasswordFt] = useState("")
  const [errorPasswordFt, setErrorPasswordFt] = useState(false)
  const [errorConfirmFt, setErrorConfirmFt] = useState(false)
  const [errorMissMatch, setErrorMissMatch] = useState(false)
  const [errorLength, setErrorLength] = useState(false)

  const handleChangePasswordFirstTime = async (e) => {
    e.preventDefault()

    setErrorPasswordFt(false)
    setErrorLength(false)
    setErrorConfirmFt(false)
    setErrorMissMatch(false)

    if (!passwordFt.trim()) {
      setErrorPasswordFt(true)
      return
    }

    if (passwordFt.length < 8) {
        setErrorLength(true)
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
    }

    try {
      await changePasswordFirstTime(confirmPasswordFt)
      const updateUser = { ...user, firstLogin: false }
      setUser(updateUser)
      localStorage.setItem("user", JSON.stringify(updateUser))
      alert("Đổi mật khẩu thành công ! Vui lòng đăng nhập lại.")
      onClose()
    } catch (err) {
      console.error("Change password first time failed", err)
    }
  }

  return (
    <div className="change-password-first-time-modal-overlay" onClick={onClose} >
      <motion.div 
        className="change-password-first-time-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0  }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="change-password-first-time-icon">
            <GoLock className="change-password-first-time-lock-icon"/>
        </div>
        
        <h2 className="change-password-first-time-modal-title">Cập nhật mật khẩu</h2>
        <p className="change-password-first-time-modal-subtitle">
          Đây là lần đăng nhập đầu tiên của bạn. <br/>
          Vui lòng đổi mật khẩu để bảo vệ tài khoản.
        </p>

        <form onSubmit={handleChangePasswordFirstTime} className="change-password-first-time-modal-form">
          <div className="change-password-first-time-form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới..."
              value={passwordFt}
              onChange={(e) => {
                setPasswordFt(e.target.value)
                setErrorPasswordFt(false)
              }}
              className={errorPasswordFt ? "input-error" : ""}
            />
            {errorPasswordFt && <span className="change-password-first-time-form-group-error-text">Vui lòng nhập mật khẩu mới</span>}
            {errorLength && <span className="change-password-first-time-form-group-error-text">Mật khẩu phải có ít nhất 8 ký tự</span>}
          </div>

          <div className="change-password-first-time-form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu..."
              value={confirmPasswordFt}
              onChange={(e) => {
                setConfirmPasswordFt(e.target.value)
                setErrorConfirmFt(false)
                setErrorMissMatch(false)
              }}
              className={errorConfirmFt || errorMissMatch ? "input-error" : ""}
            />
            {errorConfirmFt && <span className="change-password-first-time-form-group-error-text">Vui lòng xác nhận lại mật khẩu</span>}
            {errorMissMatch && <span className="change-password-first-time-form-group-error-text">Mật khẩu không khớp</span>}
          </div>

          <button type="submit" className="change-password-first-time-form-group-btn-confirm">
            Đổi mật khẩu và Tiếp tục
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ChangePasswordFirstTime