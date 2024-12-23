import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import './AdminRegistration.css'

const AdminRegistration = () => {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Check if current user is admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          navigate('/admin/login')
          return
        }

        const response = await axios.get('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data.role !== 'admin') {
          navigate('/')
          toast.error('Not authorized to access this page')
        } else {
          setIsAuthorized(true)
        }
      } catch (error) {
        navigate('/admin/login')
      }
    }

    checkAuth()
  }, [navigate])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationKey: '' // Special key required for admin registration
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const response = await axios.post('/api/admin/register', formData)
      toast.success('Admin account created successfully')
      // Redirect to admin login or dashboard
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin account')
    }
  }

  if (!isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <div className="admin-registration">
      <div className="registration-card">
        <h2>Create Admin Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

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
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationKey">Registration Key</label>
            <input
              type="password"
              id="registrationKey"
              name="registrationKey"
              value={formData.registrationKey}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminRegistration 