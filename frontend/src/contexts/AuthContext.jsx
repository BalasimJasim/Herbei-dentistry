import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data)
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('adminToken')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    const response = await axios.post('http://localhost:5000/api/admin/login', credentials)
    const { token, user } = response.data
    localStorage.setItem('adminToken', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 