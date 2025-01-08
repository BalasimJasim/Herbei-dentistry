import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import styles from "./AppointmentViewModal.module.css";

const AppointmentViewModal = ({ appointment, onClose, onEdit, onCancel }) => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: format(date, "MMMM d, yyyy"),
      time: format(date, "h:mm a"),
    };
  };

  const { date, time } = formatDateTime(appointment.dateTime);

  const handleCancelClick = () => {
    setIsConfirmingCancel(true);
  };

  const handleConfirmCancel = () => {
    onCancel(appointment._id);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>Appointment Details</h2>
          <div className={styles.statusBadge} data-status={appointment.status}>
            {appointment.status}
          </div>
        </div>

        <div className={styles.appointmentDetails}>
          <div className={styles.detailGroup}>
            <div className={styles.detailItem}>
              <FaCalendar className={styles.icon} />
              <div>
                <label>Date</label>
                <p>{date}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <FaClock className={styles.icon} />
              <div>
                <label>Time</label>
                <p>{time}</p>
              </div>
            </div>
          </div>

          <div className={styles.detailGroup}>
            <div className={styles.detailItem}>
              <FaUser className={styles.icon} />
              <div>
                <label>Patient</label>
                <p>{`${appointment.firstName} ${appointment.lastName}`}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <FaPhone className={styles.icon} />
              <div>
                <label>Phone</label>
                <p>{appointment.phone}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <FaEnvelope className={styles.icon} />
              <div>
                <label>Email</label>
                <p>{appointment.email}</p>
              </div>
            </div>
          </div>

          <div className={styles.serviceDetails}>
            <h3>Service</h3>
            <p>{appointment.serviceId?.name || "Service name not available"}</p>
            {appointment.notes && (
              <div className={styles.notes}>
                <h4>Notes</h4>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {appointment.status === "scheduled" && (
          <div className={styles.modalActions}>
            {!isConfirmingCancel ? (
              <>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(appointment)}
                >
                  <FaEdit /> Edit Appointment
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancelClick}
                >
                  Cancel Appointment
                </button>
              </>
            ) : (
              <div className={styles.confirmCancel}>
                <p>Are you sure you want to cancel this appointment?</p>
                <div className={styles.confirmButtons}>
                  <button
                    className={styles.confirmButton}
                    onClick={handleConfirmCancel}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className={styles.denyButton}
                    onClick={() => setIsConfirmingCancel(false)}
                  >
                    No, Keep
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

AppointmentViewModal.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    notes: PropTypes.string,
    serviceId: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AppointmentViewModal;
