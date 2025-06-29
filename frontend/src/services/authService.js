import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  async signup(userData) {
    const response = await api.post('/auth/signup', userData)
    return response
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  }
} 