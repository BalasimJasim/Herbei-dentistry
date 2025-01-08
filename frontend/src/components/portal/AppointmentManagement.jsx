import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import classNames from "./AppointmentManagement.module.css";
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
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointment = (appointment) => {
    console.log("Opening modal for appointment:", appointment);
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await api.patch(
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
      const response = await api.patch(
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

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return <div className={classNames.loading}>Loading appointments...</div>;
  }

  return (
    <div className={classNames.container}>
      <section className={classNames.section}>
        <h2>Upcoming Appointments</h2>
        {appointments.upcoming.length === 0 ? (
          <div className={classNames.emptyState}>
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className={classNames.appointmentsList}>
            {appointments.upcoming.map((appointment) => (
              <div
                key={appointment._id}
                className={classNames.appointmentItem}
                onClick={() => handleViewAppointment(appointment)}
                role="button"
                tabIndex={0}
              >
                <div className={classNames.serviceInfo}>
                  <h3>{appointment.serviceId?.name || "Unnamed Service"}</h3>
                  <span
                    className={classNames.status}
                    data-status={appointment.status}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className={classNames.dateTime}>
                  {formatDateTime(appointment.dateTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={classNames.section}>
        <h2>Past Appointments</h2>
        {appointments.past.length === 0 ? (
          <div className={classNames.emptyState}>
            <p>No past appointments</p>
          </div>
        ) : (
          <div className={classNames.appointmentsList}>
            {appointments.past.map((appointment) => (
              <div
                key={appointment._id}
                className={classNames.appointmentItem}
                onClick={() => handleViewAppointment(appointment)}
                role="button"
                tabIndex={0}
              >
                <div className={classNames.serviceInfo}>
                  <h3>{appointment.serviceId?.name || "Unnamed Service"}</h3>
                  <span
                    className={classNames.status}
                    data-status={appointment.status}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className={classNames.dateTime}>
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
