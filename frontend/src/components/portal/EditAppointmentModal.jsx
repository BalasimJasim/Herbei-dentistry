import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";
import styles from "./EditAppointmentModal.module.css";

const EditAppointmentModal = ({ appointment, onClose, onSubmit }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(
    appointment.dateTime
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(appointment._id, {
        dateTime: selectedDateTime,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>Edit Appointment</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Current Date & Time:</label>
            <p>{format(new Date(appointment.dateTime), "PPpp")}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newDateTime">New Date & Time:</label>
            <input
              type="datetime-local"
              id="newDateTime"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !selectedDateTime}
            >
              {loading ? "Updating..." : "Update Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditAppointmentModal.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditAppointmentModal;
