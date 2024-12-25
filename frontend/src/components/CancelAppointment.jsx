import React, { useState } from "react";
import axios from "axios";

const CancelAppointment = ({ appointmentId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition-colors ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {loading ? "Cancelling..." : "Cancel Appointment"}
    </button>
  );
};

export default CancelAppointment;
