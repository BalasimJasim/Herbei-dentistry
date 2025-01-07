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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleCancel = async (appointmentId) => {
    try {
      const response = await api.patch(
        `/api/appointments/${appointmentId}/cancel`
      );

      if (response.data.success) {
        toast.success("Appointment cancelled successfully");
        // Refresh appointments list
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

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true);
  };

  const handleEditSubmit = async (appointmentId, updatedData) => {
    try {
      const response = await api.patch(
        `/api/appointments/${appointmentId}`,
        updatedData
      );

      if (response.data.success) {
        toast.success("Appointment updated successfully");
        setIsEditing(false);
        setSelectedAppointment(null);
        // Refresh appointments list
        loadAppointments();
      } else {
        throw new Error(
          response.data.message || "Failed to update appointment"
        );
      }
    } catch (error) {
      console.error("Update appointment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  };

  const loadAppointments = async () => {
    try {
      if (!user?.userId || !user?.email) {
        console.error("Missing user data:", user);
        throw new Error("Missing user data");
      }

      console.log("Debug - Request details:", {
        userId: user.userId,
        email: user.email,
        token: localStorage.getItem("token")?.substring(0, 20) + "...",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const response = await api.get("/api/appointments/user", {
        params: {
          email: user.email,
          userId: user.userId,
        },
        validateStatus: function (status) {
          return status < 500;
        },
      });

      console.log("API Response:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

      let appointmentsData = response.data;
      if (Array.isArray(response.data)) {
        const now = new Date();
        const { upcoming, past } = response.data.reduce(
          (acc, apt) => {
            if (new Date(apt.dateTime) > now) {
              acc.upcoming.push(apt);
            } else {
              acc.past.push(apt);
            }
            return acc;
          },
          { upcoming: [], past: [] }
        );
        appointmentsData = { upcoming, past };
      } else if (response.data.data) {
        appointmentsData = response.data.data;
      }

      if (!appointmentsData) {
        throw new Error("Invalid response format");
      }

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Debug - Error details:", {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        user: user,
        error: error.response?.data?.error || error.response?.data?.message,
      });

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
    return <div className={styles.error}>{error}</div>;
  }

  const canModifyAppointment = (appointment) => {
    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    // Allow modifications up to 24 hours before the appointment
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2>Upcoming Appointments</h2>
        {appointments.upcoming?.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <ul className={styles.appointmentList}>
            {appointments.upcoming?.map((apt) => (
              <li key={apt._id} className={styles.appointmentItem}>
                <div className={styles.serviceInfo}>
                  <h3>{apt.serviceId?.name}</h3>
                  <span className={styles.status}>{apt.status}</span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(apt.dateTime)}
                </div>
                {canModifyAppointment(apt) && (
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleEdit(apt)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                      disabled={apt.status === "cancelled"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      disabled={apt.status === "cancelled"}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2>Past Appointments</h2>
        {appointments.past?.length === 0 ? (
          <p>No past appointments</p>
        ) : (
          <ul className={styles.appointmentList}>
            {appointments.past?.map((apt) => (
              <li key={apt._id} className={styles.appointmentItem}>
                <div className={styles.serviceInfo}>
                  <h3>{apt.serviceId?.name}</h3>
                  <span className={styles.status}>{apt.status}</span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(apt.dateTime)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isEditing && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setIsEditing(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;
