import { useState, useEffect } from "react";
import styles from "./EditAppointmentModal.module.css";
import { toast } from "react-toastify";
import api from "../../utils/axios";

const EditAppointmentModal = ({ appointment, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(
    appointment.dateTime
  );

  useEffect(() => {
    loadAvailableSlots();
  }, [appointment.serviceId]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const date = new Date(appointment.dateTime);
      const response = await api.get("/api/appointments/available", {
        params: {
          date: date.toISOString().split("T")[0],
          serviceId: appointment.serviceId._id,
        },
      });

      if (response.data.success) {
        setAvailableSlots(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to load available time slots");
      console.error("Load slots error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDateTime) {
      toast.error("Please select a date and time");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(appointment._id, {
        dateTime: selectedDateTime,
      });
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Reschedule Appointment</h2>
        <p>
          Current appointment: {new Date(appointment.dateTime).toLocaleString()}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Select New Time:</label>
            <div className={styles.timeSlots}>
              {loading ? (
                <p>Loading available slots...</p>
              ) : availableSlots.length === 0 ? (
                <p>No available slots for this date</p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`${styles.timeSlot} ${
                      selectedDateTime === slot ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedDateTime(slot)}
                  >
                    {formatSlotTime(slot)}
                  </button>
                ))
              )}
            </div>
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

export default EditAppointmentModal;
