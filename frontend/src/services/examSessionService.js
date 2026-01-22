import { ExamSessionForAdmin } from "../models/ExamSessionForAdmin";
import { ExamSessionForStudent } from "../models/ExamSessionForStudent";
import apiCall from "../utils/api";

export const examSessionService = {

  //student

  getExamSessions: async (examId) => {
    const response = await apiCall(`/exam-sessions/exam/${examId}`, {
      method: 'GET'
    })

    const examSessions = response.data.map(examSesison => ExamSessionForStudent.fromJSON(examSesison));
    return examSessions;
  },

  registerExamSession: async (examSessionId) => {
    const response = await apiCall(`/exam-sessions/${examSessionId}/register`, {
      method: 'POST'
    })
    return response.message
  },

  getExamSessionsBySubjectIdForStudent: async (subjectId, examId) => {
    const response = await apiCall(`/exam-sessions/by-subject/${subjectId}/by-exam/${examId}`, {
      method: 'GET'
    })
    const examSessions = response.data.map(es => ExamSessionForStudent.fromJSON(es))
    return examSessions
  },

  //admin

  createExamSession: async (sessionData) => {
    const response = await apiCall('/exam-sessions/create', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
    return response.data || response;
  },

  getExamSessionsBySubjectId: async (subjectId, examId) => {
    const response = await apiCall(`/exam-sessions?subjectId=${subjectId}&examId=${examId}`, {
      method: 'GET'
    });
    
    const data = response.data || response;
    const examSessions = data.map(es => ExamSessionForAdmin.fromJSON(es));
    return examSessions;
  },

  updateExamSession: async (id, examSession) => {
    const response = await apiCall(`/exam-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        date: examSession.date,
        startTime: examSession.startTime,
        capacity: examSession.capacity,
        roomId: examSession.roomId,
      })
    })
  },

  delete: async (id) => {
    const response = await apiCall(`/exam-sessions/${id}`, {
      method: 'DELETE'
    })
    return response.data
  }
}
