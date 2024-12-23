import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    serviceBreakdown: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.get('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(response.data.data)
      } catch (error) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <p className="stat-number">{stats.todayAppointments?.count || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <p className="stat-number">{stats.upcomingAppointments?.count || 0}</p>
        </div>
      </div>

      <section className="service-breakdown">
        <h2>Service Breakdown</h2>
        <div className="service-stats">
          {stats.serviceBreakdown?.map(service => (
            <div key={service._id} className="service-stat">
              <h4>{service._id}</h4>
              <p>{service.count} appointments</p>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/admin/register'}>
            Add New Admin
          </button>
          <button onClick={() => window.location.href = '/appointments'}>
            View All Appointments
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 