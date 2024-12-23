import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import ManageAppointments from '../components/ManageAppointments'
import './PatientPortal.css'

const PatientPortal = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Simulate authentication
      setIsAuthenticated(true)
      setUserEmail(formData.email)
      toast.success(isLogin ? 'Login successful!' : 'Account created successfully!')
    } catch {
      toast.error(isLogin ? 'Login failed' : 'Registration failed')
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Patient Portal - Herbie Dental Clinic</title>
          <meta 
            name="description" 
            content="Manage your dental appointments and records through our secure patient portal."
          />
        </Helmet>

        <section className="portal-hero">
          <div className="container">
            <h1>Welcome to Your Patient Portal</h1>
            <p className="lead">Manage your appointments and dental care</p>
          </div>
        </section>

        <section className="portal-content">
          <div className="container">
            <div className="portal-grid">
              <div className="portal-sidebar">
                <button 
                  className="logout-button"
                  onClick={() => {
                    setIsAuthenticated(false)
                    setUserEmail('')
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      firstName: '',
                      lastName: ''
                    })
                  }}
                >
                  Logout
                </button>
              </div>

              <div className="portal-main">
                <ManageAppointments userEmail={userEmail} />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Patient Portal - Herbie Dental Clinic</title>
        <meta 
          name="description" 
          content="Access your dental records, appointments, and more through our secure patient portal."
        />
      </Helmet>

      <section className="portal-hero">
        <div className="container">
          <h1>Patient Portal</h1>
          <p className="lead">Access your dental care information securely</p>
        </div>
      </section>

      <section className="portal-content">
        <div className="container">
          <div className="auth-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="email">Email *</label>
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
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <button type="submit" className="submit-button">
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>

            {isLogin && (
              <p className="forgot-password">
                <a href="/forgot-password">Forgot your password?</a>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default PatientPortal 