import { examSessionService } from "../services/examSessionService"

export const useExamSession = () => {

  const getExamSessions = async (examId) => {
    try {
      const examSessions = await examSessionService.getExamSessions(examId)
      return examSessions
    } catch (error) {
      throw error
    }
  }

  const getExamSessionsBySubjectId = async (subjectId, examId) => {
    try {
      const examSessions = await examSessionService.getExamSessionsBySubjectIdForStudent(subjectId, examId)
      return examSessions
    } catch (error) {
      throw error
    }
  }

  const registerExamSession = async (examSessionId) => {
    try {
      const response = await examSessionService.registerExamSession(examSessionId)
      return response
    } catch (error) {
      throw error
    }
  }

  return { getExamSessions, getExamSessionsBySubjectId, registerExamSession }
}