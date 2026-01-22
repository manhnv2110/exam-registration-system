const API_BASE_URL = import.meta.env.VITE_API_URL
const API_URL = API_BASE_URL + "/api/v1"


export const importLogService = {
  importStudentAccounts: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_URL}/import/students`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    if (!response.ok) {
      throw new Error("Import failed")
    }
    return await response.json()
  },

  importStudentsCondition: async (examId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_URL}/import/exam/${examId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `Import failed with status ${response.status}`)
    }
    return await response.json()
  }
}