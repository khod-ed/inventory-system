import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored authentication token and validate it
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      // Validate token with backend
      authService.getCurrentUser()
        .then(response => {
          setIsAuthenticated(true)
          setUser(response.data.user)
        })
        .catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          setIsAuthenticated(false)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.user))
      
      setIsAuthenticated(true)
      setUser(response.data.user)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await authService.signup({ firstName, lastName, email, password })
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 