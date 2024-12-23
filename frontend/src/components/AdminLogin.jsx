import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import './AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [attempts, setAttempts] = useState(0)
  const MAX_ATTEMPTS = 5
  const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

  useEffect(() => {
    const lockoutEnd = localStorage.getItem('adminLockoutEnd')
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      setErrors({ general: `Account locked. Try again in ${Math.ceil((parseInt(lockoutEnd) - Date.now()) / 60000)} minutes` })
    }
  }, [])

  // If user is already logged in and is admin, redirect to dashboard
  if (auth.user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Check if account is locked
    const lockoutEnd = localStorage.getItem('adminLockoutEnd')
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      setErrors({ general: 'Account locked. Please try again later.' })
      setLoading(false)
      return
    }

    try {
      await auth.login(formData)
      setAttempts(0)
      localStorage.removeItem('adminLockoutEnd')
      toast.success('Login successful')
      // Redirect to the page they were trying to visit or dashboard
      const from = location.state?.from?.pathname || '/admin/dashboard'
      navigate(from, { replace: true })
    } catch (error) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_TIME
        localStorage.setItem('adminLockoutEnd', lockoutEnd.toString())
        setErrors({ general: 'Too many failed attempts. Account locked for 15 minutes.' })
      } else {
        setErrors({ general: `Login failed. ${MAX_ATTEMPTS - newAttempts} attempts remaining.` })
      }
      
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin 