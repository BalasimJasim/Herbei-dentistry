import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./AppointmentManagement.module.css";
import AppointmentViewModal from "./AppointmentViewModal";
import EditAppointmentModal from "./EditAppointmentModal";
import api from "../../utils/axios";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/appointments/user");
      const appointments = response.data;

      // Split appointments into upcoming and past
      const now = new Date();
      const splitAppointments = {
        upcoming: appointments.filter((apt) => new Date(apt.dateTime) >= now),
        past: appointments.filter((apt) => new Date(apt.dateTime) < now),
      };

      setAppointments(splitAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await api.put(
        `/api/appointments/${appointmentId}/cancel`
      );
      if (response.data.success) {
        toast.success("Appointment cancelled successfully");
        loadAppointments();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleUpdateAppointment = async (appointmentId, updatedData) => {
    try {
      const response = await api.put(
        `/api/appointments/${appointmentId}`,
        updatedData
      );
      if (response.data.success) {
        toast.success("Appointment updated successfully");
        loadAppointments();
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await api.delete(`/api/appointments/${appointmentId}`);
      if (response.data.success) {
        toast.success("Appointment deleted successfully");
        loadAppointments();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2>Upcoming Appointments</h2>
        {appointments.upcoming.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.upcoming.map((appointment) => (
              <div
                key={appointment._id}
                className={styles.appointmentItem}
                onClick={() => handleViewAppointment(appointment)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.serviceInfo}>
                  <h3>{appointment.serviceId?.name || "Unnamed Service"}</h3>
                  <span
                    className={styles.status}
                    data-status={appointment.status}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(appointment.dateTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Past Appointments</h2>
        {appointments.past.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No past appointments</p>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {appointments.past.map((appointment) => (
              <div
                key={appointment._id}
                className={styles.appointmentItem}
                onClick={() => handleViewAppointment(appointment)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.serviceInfo}>
                  <h3>{appointment.serviceId?.name || "Unnamed Service"}</h3>
                  <span
                    className={styles.status}
                    data-status={appointment.status}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className={styles.dateTime}>
                  {formatDateTime(appointment.dateTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isViewModalOpen && selectedAppointment && (
        <AppointmentViewModal
          appointment={selectedAppointment}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedAppointment(null);
          }}
          onEdit={handleEditAppointment}
          onCancel={handleCancelAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}

      {isEditModalOpen && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleUpdateAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;
