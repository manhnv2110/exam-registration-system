import { jsx } from "react/jsx-runtime";
import apiCall from "../utils/api";
import { StudentResponse } from "../models/Student";

export const studentService = {
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiCall('/student/change-password', {
      method: 'POST',
      body: JSON.stringify({currentPassword, newPassword})
    })
    return response.message
  },

  addStudent: async (studentData) => {
    try {
      const response = await apiCall('/student/add', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    const response = await apiCall('/student/all', {
      method: 'GET'
    })
    return response.data
  },

  update: async (id, student) => {
    const response = await apiCall(`/student/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                code: student.code,
                name: student.name,
                gender: student.gender,
                className: student.className,
                major: student.major,
                faculty: student.faculty,
                dob: student.dob,
                email: student.email,
                phone: student.phone
            })
        })
        return StudentResponse.fromJSON(response.data)
  },

  delete: async (id) => {
    const respone = await apiCall(`/student/delete/${id}`, {
      method: 'DELETE'
    })
    return respone.data
  }
}