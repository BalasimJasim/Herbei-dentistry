import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./AppointmentViewModal.module.css";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { toast } from "react-toastify";
import api from "../../utils/axios";

const AppointmentViewModal = ({ appointment, onClose, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!appointment) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/appointments/${appointment._id}`);
      toast.success("Appointment deleted successfully");
      onDelete(appointment._id);
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const canDelete = appointment.status.toLowerCase() === "cancelled";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalContent}>
          <h2>Appointment Details</h2>

          <div className={styles.appointmentInfo}>
            <div className={styles.infoGroup}>
              <label>Date:</label>
              <span>{formatDate(new Date(appointment.dateTime))}</span>
            </div>

            <div className={styles.infoGroup}>
              <label>Time:</label>
              <span>{formatTime(new Date(appointment.dateTime))}</span>
            </div>

            <div className={styles.infoGroup}>
              <label>Service:</label>
              <span>{appointment.serviceId?.name || "Unnamed Service"}</span>
            </div>

            {appointment.notes && (
              <div className={styles.infoGroup}>
                <label>Notes:</label>
                <span>{appointment.notes}</span>
              </div>
            )}

            <div className={styles.infoGroup}>
              <label>Status:</label>
              <span
                className={`${styles.status} ${
                  styles[appointment.status.toLowerCase()]
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {!showDeleteConfirm ? (
              <>
                {appointment.status.toLowerCase() === "booked" && (
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit(appointment)}
                    disabled={loading}
                  >
                    Edit Appointment
                  </button>
                )}
                {canDelete && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                  >
                    Delete Appointment
                  </button>
                )}
              </>
            ) : (
              <div className={styles.confirmDelete}>
                <p>
                  Are you sure you want to delete this cancelled appointment?
                  This action cannot be undone.
                </p>
                <div className={styles.confirmButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmDeleteButton}
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AppointmentViewModal.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    serviceId: PropTypes.shape({
      name: PropTypes.string,
    }),
    status: PropTypes.string.isRequired,
    notes: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AppointmentViewModal;
