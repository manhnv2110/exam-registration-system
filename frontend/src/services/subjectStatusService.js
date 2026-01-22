import { Condition } from "../models/Condition"
import { SubjectStatus } from "../models/SubjectStatus"
import apiCall from "../utils/api"

export const subjectStatusService = {
  getSubjectStatus: async (examId) => {
    const response = await apiCall(`/subject-status/exam/${examId}`, {
      method: 'GET'
    })
    const subjectStatus = response.data.map(ss => SubjectStatus.fromJSON(ss))
    return subjectStatus
  },

  getStudentsCondition: async (subjectId, examId) => {
    const response = await apiCall(`/subject-status/${subjectId}/exam/${examId}`, {
      method: 'GET'
    })
    const condition = response.data.map(c => Condition.fromJSON(c))
    return condition
  }
}