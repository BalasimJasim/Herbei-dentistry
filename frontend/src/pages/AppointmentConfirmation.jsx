import { useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'
import './AppointmentConfirmation.css'

const AppointmentConfirmation = () => {
  const location = useLocation()
  const { appointment } = location.state || {}

  if (!appointment) {
    return (
      <div className="confirmation-error">
        <h2>No appointment information found</h2>
        <p>Please try booking your appointment again.</p>
        <Link to="/appointments" className="book-again-btn">Book Appointment</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Appointment Confirmation - Herbie Dental Clinic</title>
        <meta 
          name="description" 
          content="Your appointment has been confirmed with Herbie Dental Clinic."
        />
      </Helmet>

      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <FaCheckCircle className="success-icon" />
            <h1>Appointment Confirmed!</h1>
            <p>Thank you for choosing Herbie Dental Clinic</p>
          </div>

          <div className="appointment-details">
            <h2>Appointment Details</h2>
            
            <div className="detail-row">
              <FaCalendarAlt className="detail-icon" />
              <div>
                <strong>Date:</strong>
                <p>{appointment.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaClock className="detail-icon" />
              <div>
                <strong>Time:</strong>
                <p>{appointment.time}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaUser className="detail-icon" />
              <div>
                <strong>Patient:</strong>
                <p>{appointment.firstName} {appointment.lastName}</p>
              </div>
            </div>

            <div className="detail-row">
              <div>
                <strong>Service:</strong>
                <p>{appointment.service}</p>
                <p className="duration">Duration: {appointment.duration} minutes</p>
              </div>
            </div>

            <div className="contact-details">
              <div className="detail-row">
                <FaPhone className="detail-icon" />
                <div>
                  <strong>Phone:</strong>
                  <p>{appointment.phone}</p>
                </div>
              </div>

              <div className="detail-row">
                <FaEnvelope className="detail-icon" />
                <div>
                  <strong>Email:</strong>
                  <p>{appointment.email}</p>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="notes-section">
                <strong>Additional Notes:</strong>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>

          <div className="confirmation-footer">
            <div className="reminder-text">
              <p>A confirmation email has been sent to {appointment.email}</p>
              <p>You will receive a reminder 24 hours before your appointment.</p>
            </div>

            <div className="important-info">
              <h3>Important Information:</h3>
              <ul>
                <li>Please arrive 15 minutes before your appointment time</li>
                <li>Bring a valid ID and insurance card (if applicable)</li>
                <li>If you need to reschedule, please give at least 24 hours notice</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="add-to-calendar">Add to Calendar</button>
              <Link to="/appointments" className="book-another">Book Another Appointment</Link>
              <Link to="/patient-portal" className="view-appointments">View My Appointments</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppointmentConfirmation 