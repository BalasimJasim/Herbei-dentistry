import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./EditAppointmentModal.module.css";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { toast } from "react-toastify";
import api from "../../utils/axios";

const EditAppointmentModal = ({ appointment, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.dateTime);
      setFormData({
        date: formatDate(appointmentDate),
        time: formatTime(appointmentDate),
        notes: appointment.notes || "",
      });
      fetchAvailableTimeSlots(formatDate(appointmentDate));
    }
  }, [appointment]);

  const fetchAvailableTimeSlots = async (selectedDate) => {
    try {
      const response = await api.get(
        `/api/appointments/available?date=${selectedDate}`
      );
      if (response.data) {
        setAvailableTimeSlots(
          response.data.map((slot) => formatTime(new Date(slot)))
        );
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setError("Failed to load available time slots");
      toast.error("Failed to load available time slots");
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "date") {
      await fetchAvailableTimeSlots(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      await onSubmit(appointment._id, {
        dateTime: dateTime.toISOString(),
        notes: formData.notes,
      });

      onClose();
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError(error.response?.data?.message || "Failed to update appointment");
      toast.error("Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Edit Appointment</h2>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={formatDate(new Date())}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a time</option>
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
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
    notes: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditAppointmentModal;
