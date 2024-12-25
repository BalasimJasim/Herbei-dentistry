import React, { useState, useEffect } from "react";
import axios from "axios";
import CancelAppointment from "./CancelAppointment";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments/user", {
        params: { email: localStorage.getItem("userEmail") },
      });
      setAppointments(Array.isArray(response.data) ? response.data : []);
      console.log("Fetched appointments:", response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetchAppointments();
    } else {
      setError("Please log in to view appointments");
      setLoading(false);
    }
  }, []);

  const handleCancelSuccess = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((app) => app._id !== appointmentId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
      {!Array.isArray(appointments) || appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {new Date(appointment.dateTime).toLocaleString()}
                  </p>
                  <p>Service: {appointment.serviceId}</p>
                  <p>Status: {appointment.status}</p>
                </div>
                {appointment.status === "scheduled" && (
                  <CancelAppointment
                    appointmentId={appointment._id}
                    onSuccess={() => handleCancelSuccess(appointment._id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
