import { useContext } from "react"
import { examService } from "../services/examService"
import MyContext from "../context/MyContext"

export const useExam  = () => {

  const { setOpenExam } = useContext(MyContext)

  const getExamIsOpen = async () => {
    try {
      const openExam = await examService.getExamIsOpen()
      localStorage.setItem('exam', JSON.stringify(openExam))
      setOpenExam(openExam)
      return openExam
    } catch (error) {
      throw error
    }
  }

  const addSubjectsToExam = async (examId, subjectIds) => {
    try {
      const response = await examService.addSubjectsToExam(examId, subjectIds)
      return response
    } catch (error) {
      throw error
    }
  }

  return {getExamIsOpen, addSubjectsToExam}
}