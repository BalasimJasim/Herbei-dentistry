import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./AppointmentManagement.module.css";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  const formatDateTime = (dateString) => {
    try {
      if (!dateString) {
        return "Date not available";
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch (error) {
      return "Date error";
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await api.patch(
        `/api/appointments/${appointmentId}/cancel`
      );
      if (response.data.success) {
        toast.success("Appointment cancelled successfully");
        loadAppointments();
      } else {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  const loadAppointments = async () => {
    try {
      if (!user?.userId || !user?.email) {
        throw new Error("Missing user data");
      }

      const response = await api.get("/api/appointments/user");

      if (response.data.success && response.data.data) {
        setAppointments({
          upcoming: response.data.data.upcoming || [],
          past: response.data.data.past || [],
        });
      } else {
        throw new Error("Invalid response format");
      }

      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again");
        logout();
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load appointments";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button onClick={loadAppointments} className={styles.actionButton}>
          Try Again
        </button>
      </div>
    );
  }

  const canModifyAppointment = (appointment) => {
    const appointmentDate = new Date(appointment.date || appointment.dateTime);
    const now = new Date();
    // Allow modifications up to 24 hours before the appointment
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2>Upcoming Appointments</h2>
        {!appointments.upcoming ? (
          <div className={styles.emptyState}>
            <p>Loading appointments...</p>
          </div>
        ) : appointments.upcoming.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.upcoming.map((apt) => (
              <div key={apt._id} className={styles.appointmentItem}>
                <div className={styles.serviceInfo}>
                  <h3>
                    {apt.service?.name ||
                      apt.serviceId?.name ||
                      "Unnamed Service"}
                  </h3>
                  <span className={styles.status}>
                    {apt.status || "scheduled"}
                  </span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(apt.date || apt.dateTime)}
                </div>
                {canModifyAppointment(apt) && apt.status !== "cancelled" && (
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Past Appointments</h2>
        {!appointments.past ? (
          <div className={styles.emptyState}>
            <p>Loading appointments...</p>
          </div>
        ) : appointments.past.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No past appointments</p>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.past.map((apt) => (
              <div key={apt._id} className={styles.appointmentItem}>
                <div className={styles.serviceInfo}>
                  <h3>
                    {apt.service?.name ||
                      apt.serviceId?.name ||
                      "Unnamed Service"}
                  </h3>
                  <span className={styles.status}>
                    {apt.status || "completed"}
                  </span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(apt.date || apt.dateTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AppointmentManagement;
