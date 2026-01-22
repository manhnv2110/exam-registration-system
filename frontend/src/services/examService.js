import apiCall from "../utils/api";
import { Exam, ExamResponse } from "../models/Exam";
export const examService = {
    add : async(exam) => {
        const response = await apiCall('/exams/add', {
            method: 'POST',
            body: JSON.stringify(exam)
        })

        return ExamResponse.fromJSON(response.data)
    },

    getAll: async () => {
        const response = await apiCall('/exams', {
            method: 'GET'
        })
        return response.data 
    },

    update: async (id, exam) => {
        const response = await apiCall(`/exams/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                examName: exam.name,
                startDate: exam.startDate,
                endDate: exam.endDate,
                description: exam.description
            })
        })
        return ExamResponse.fromJSON(response.data)
    },

    delete: async (examId) => {
        const response = await apiCall(`/exams/${examId}`, {
            method: 'DELETE'
        })
        return response.data
    },

    close: async (examId) => {
        const response = await apiCall(`/exams/${examId}/close`, {
            method: 'PUT'
        }) 
        return ExamResponse.fromJSON(response.data)
    },

    open: async (examId) => {
        const response = await apiCall(`/exams/${examId}/open`, {
            method: 'PUT'
        }) 
        return ExamResponse.fromJSON(response.data)
    },

    getExamIsOpen: async () => {
        const response = await apiCall('/exams/is-open', {
            method: 'GET'
        })
        return Exam.fromJSON(response.data)
    },

    addSubjectsToExam: async (examId, subjectsIds) => {
        const response = await apiCall(`/exams/${examId}/subjects`, {
            method: 'POST',
            body: JSON.stringify(subjectsIds)
        })
        return response.data
    },
    
    getSubjectsOfExam: async (examId) => {
        const response = await apiCall(`/exams/${examId}/subjects`, {
            method: 'GET',
        })
        return response.data;
    },

    deleteSubject: async (examId, subjectId) => {
        const response = await apiCall(`/exams/${examId}/subjects/${subjectId}`, {
            method: 'DELETE'
        })
        return response.data;
    }
}