import apiCall from "../utils/api";
import { Subject } from "../models/Subject";

export const courseService = {
    getAll: async () => {
        const response = await apiCall('/subjects', {
            method: 'GET'
        })
        return response.data
    },
    getSubjectById: async (subjectId) => {
        const response = await apiCall(`/subjects/${subjectId}`, {
            method: 'GET'
        })
        return response.data
    }
}