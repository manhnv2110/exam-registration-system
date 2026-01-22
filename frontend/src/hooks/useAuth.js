import { useContext } from "react"
import { authService } from "../services/authService"
import MyContext from "../context/MyContext"
import { useNavigate } from "react-router-dom"

export const useAuth = () => {

  const { user, setUser } = useContext(MyContext)
  const navigate = useNavigate()

  const login = async (email, password) => {
    try {
      const authResponse = await authService.login(email, password)
      setUser(authResponse.user)
      // const u = authResponse.user
      // if (u.role === 'STUDENT') {
      //   if (u.firstLogin) navigate('/student/student-account')
      //   else navigate('/student/exam-schedule')
      // } else if (u.role === 'ADMIN') {
      //   navigate('/admin/student-management')
      // }
      // return authResponse

      return authResponse.user 
    } catch (e) {
      throw new Error(e.message)
    }
  }

  const changePasswordFirstTime = async (password) => {
    try {
      const response = await authService.changePasswordFirstTime(password)
      return response
    } catch (e) {
      throw e
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (e) {
      throw e
    }
  }

  const scheduleAutoLogout = (expMs) => {
    const remaining = expMs - Date.now()

    if (remaining > 0) {
      setTimeout(() => {
        logout()
      }, remaining)
    } else {
      logout()
    }
  }

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email)
    } catch (error) {
      const message = error.message || "Gửi email thất bại"
      throw new Error(message)
    }
  }

  const resetPassword = async (token, newPasword) => {
    try {
      await authService.resetPassword(token, newPasword)
    } catch (error) {
      throw error
    }
  }

  return {login, changePasswordFirstTime, logout, forgotPassword, resetPassword}
}