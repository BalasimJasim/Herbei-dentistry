import { useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'
import styles from "./AppointmentConfirmation.module.css";

const AppointmentConfirmation = () => {
  const location = useLocation();
  const { appointment } = location.state || {};

  if (!appointment) {
    return (
      <div className={styles.confirmationError}>
        <h2>No appointment information found</h2>
        <p>Please try booking your appointment again.</p>
        <Link to="/appointments" className={styles.bookAgainBtn}>
          Book Appointment
        </Link>
      </div>
    );
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

      <div className={styles.confirmationContainer}>
        <div className={styles.confirmationCard}>
          <div className={styles.confirmationHeader}>
            <FaCheckCircle className={styles.successIcon} />
            <h1>Appointment Confirmed!</h1>
            <p>Thank you for choosing Herbie Dental Clinic</p>
          </div>

          <div className={styles.appointmentDetails}>
            <h2>Appointment Details</h2>

            <div className={styles.detailRow}>
              <FaCalendarAlt className={styles.detailIcon} />
              <div>
                <strong>Date:</strong>
                <p>
                  {appointment.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <FaClock className={styles.detailIcon} />
              <div>
                <strong>Time:</strong>
                <p>{appointment.time}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <FaUser className={styles.detailIcon} />
              <div>
                <strong>Patient:</strong>
                <p>
                  {appointment.firstName} {appointment.lastName}
                </p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div>
                <strong>Service:</strong>
                <p>{appointment.service}</p>
                <p className={styles.duration}>
                  Duration: {appointment.duration} minutes
                </p>
              </div>
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.detailRow}>
                <FaPhone className={styles.detailIcon} />
                <div>
                  <strong>Phone:</strong>
                  <p>{appointment.phone}</p>
                </div>
              </div>

              <div className={styles.detailRow}>
                <FaEnvelope className={styles.detailIcon} />
                <div>
                  <strong>Email:</strong>
                  <p>{appointment.email}</p>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className={styles.notesSection}>
                <strong>Additional Notes:</strong>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>

          <div className={styles.confirmationFooter}>
            <div className={styles.reminderText}>
              <p>A confirmation email has been sent to {appointment.email}</p>
              <p>
                You will receive a reminder 24 hours before your appointment.
              </p>
            </div>

            <div className={styles.importantInfo}>
              <h3>Important Information:</h3>
              <ul>
                <li>Please arrive 15 minutes before your appointment time</li>
                <li>Bring a valid ID and insurance card (if applicable)</li>
                <li>
                  If you need to reschedule, please give at least 24 hours
                  notice
                </li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.addToCalendar}>Add to Calendar</button>
              <Link to="/appointments" className={styles.bookAnother}>
                Book Another Appointment
              </Link>
              <Link to="/patient-portal" className={styles.viewAppointments}>
                View My Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentConfirmation 