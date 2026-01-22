import { AuthResponse } from '../models/AuthResponse'
import apiCall from '../utils/api'

export const authService = {
  login : async (email, password) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, false)

    if (!response?.data?.token) {
      throw new Error(response?.message || "Login failed"); 
    }
    
    const authResponse = AuthResponse.fromJSON(response)
    localStorage.setItem('token', authResponse.token)
    localStorage.setItem('refreshToken', authResponse.refreshToken)
    localStorage.setItem('user', JSON.stringify(authResponse.user))
    return authResponse
  },

  changePasswordFirstTime : async (password) => {
    const response = await apiCall('/auth/change-password-first-time', {
      method: 'POST',
      body: JSON.stringify({password})
    })
    return response
  },

  logout : async () => {
    await apiCall('/auth/logout', {
      method: 'POST'
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  },

  forgotPassword: async(email) => {
    const response = await apiCall(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    }, false)
    return response
  },

  resetPassword: async(token, newPassword) => {
    const response = await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({token, newPassword})
    }, false)
    return response
  }
}