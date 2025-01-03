import { useState, useEffect } from 'react';
import api from "../utils/axios";
import { toast } from "react-toastify";
import "./ManageAppointments.css";

const ManageAppointments = ({ userEmail }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [userEmail]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        `/api/appointments/user?email=${userEmail}`
      );
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await api.patch(`/api/appointments/${appointmentId}/cancel`, {
        email: userEmail,
      });

      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="manage-appointments">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-info">
                <h3>{appointment.service}</h3>
                <p>
                  Date: {new Date(appointment.dateTime).toLocaleDateString()}
                </p>
                <p>
                  Time: {new Date(appointment.dateTime).toLocaleTimeString()}
                </p>
                <p>Status: {appointment.status}</p>
              </div>
              {appointment.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="cancel-button"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAppointments; 