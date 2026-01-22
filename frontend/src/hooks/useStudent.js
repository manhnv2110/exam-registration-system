import { studentService } from "../services/studentService"

export const useStudent = () => {
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await studentService.changePassword(currentPassword, newPassword)
      return response
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return {changePassword}
}