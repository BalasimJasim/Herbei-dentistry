import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './AppointmentForm.css'
import { useTranslation } from 'react-i18next'
import api from '../utils/axios'
import AppointmentCalendar from './AppointmentCalendar'

const AppointmentForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    serviceId: ''
  })

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services')
      if (response.data.success) {
        // Group services by cabinet
        const groupedServices = groupServicesByCabinet(response.data.data)
        setServices(groupedServices)
      }
    } catch (error) {
      toast.error('Failed to load services')
    }
  }

  const groupServicesByCabinet = (services) => {
    const cabinets = {
      1: { name: 'Consultation Services', services: [] },
      2: { name: 'Operative Dentistry', services: [] },
      3: { name: 'Operative Dentistry', services: [] },
      4: { name: 'Orthopedic Services', services: [] },
      5: { name: 'Orthodontics & Pediatric', services: [] },
      6: { name: 'Surgery Services', services: [] }
    }

    services.forEach(service => {
      if (service.cabinetNumber === 2 || service.cabinetNumber === 3) {
        cabinets[2].services.push(service)
      } else if (cabinets[service.cabinetNumber]) {
        cabinets[service.cabinetNumber].services.push(service)
      }
    })

    const filteredCabinets = Object.entries(cabinets)
      .filter(([key, value]) => value.services.length > 0 && key !== '3')
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})

    return filteredCabinets
  }

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId }))
    setCurrentStep(2) // Move to date selection
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setCurrentStep(3) // Move to personal info
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      // Debug logs
      console.log('Selected Date:', selectedDate)
      console.log('Selected Time:', selectedTime)

      // Create a new date object from the selected date
      const appointmentDate = new Date(selectedDate)
      
      // Parse the time from the ISO string
      const timeDate = new Date(selectedTime)
      
      // Set the hours and minutes from the selected time
      appointmentDate.setHours(
        timeDate.getHours(),
        timeDate.getMinutes(),
        0, // seconds
        0  // milliseconds
      )

      // Debug log
      console.log('Combined DateTime:', appointmentDate)

      // Format the data for submission
      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        serviceId: formData.serviceId,
        dateTime: appointmentDate.toISOString(),
        status: 'scheduled'
      }

      // Debug log
      console.log('Submitting appointment data:', appointmentData)

      const response = await api.post('/api/appointments', appointmentData)

      if (response.data.success) {
        toast.success('Appointment booked successfully!')
        navigate('/appointments/confirmation', {
          state: { appointment: response.data.data }
        })
      }
    } catch (error) {
      console.error('Booking error details:', {
        error,
        selectedDate,
        selectedTime,
        formData
      })
      const errorMessage = error.response?.data?.message || 'Failed to book appointment'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.serviceId) {
      toast.error('Please select a service')
      return false
    }
    if (!selectedDate) {
      toast.error('Please select a date')
      return false
    }
    if (!selectedTime) {
      toast.error('Please select a time')
      return false
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return false
    }

    return true
  }

  const renderServiceSelection = () => {
    return (
      <div className="service-selection">
        <h2>{t('Select Your Service')}</h2>
        <div className="service-dropdown-container">
          <select
            value={formData.serviceId}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, serviceId: e.target.value }))
              if (e.target.value) {
                setCurrentStep(2)
              }
            }}
            className="service-select"
            required
            size="10"
          >
            <option value="">{t('Choose a service...')}</option>
            {Object.entries(services).map(([category, categoryServices]) => (
              <optgroup key={category} label={categoryServices.name}>
                {categoryServices.services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {formData.serviceId && (
            <div className="selected-service-info">
              {Object.entries(services).map(([_, categoryServices]) => {
                const selectedService = categoryServices.services.find(s => s.id === formData.serviceId)
                if (selectedService) {
                  return (
                    <div key={selectedService.id}>
                      <p className="service-description">
                        {selectedService.description}
                      </p>
                      <div className="service-details">
                        <span className="duration">
                          Duration: {selectedService.duration} minutes
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="booking-container">
      {/* Progress Steps */}
      <div className="booking-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Service</div>
        </div>
        <div className="step-connector" />
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Choose Date & Time</div>
        </div>
        <div className="step-connector" />
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Personal Details</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="booking-content">
        {currentStep === 1 && renderServiceSelection()}
        {currentStep === 2 && (
          <div className="datetime-selection">
            <h2>Select Date & Time</h2>
            <AppointmentCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
              selectedTime={selectedTime}
              selectedService={formData.serviceId}
            />
          </div>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleSubmit} className="personal-info">
            <h2>{t('Personal Information')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('First Name')} *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('Last Name')} *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('Email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('Phone')} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+380991234567"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>{t('Notes')} ({t('Optional')})</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? t('Booking...') : t('Confirm Booking')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation */}
      <div className="booking-navigation">
        {currentStep > 1 && (
          <button
            type="button"
            className="back-button"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            {t('Back')}
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentForm