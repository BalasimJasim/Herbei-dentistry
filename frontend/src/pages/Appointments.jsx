import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";
import "./Appointments.css";

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const preSelectedService = searchParams.get("service");

  return (
    <div className="appointments-page">
      <Helmet>
        <title>Book Appointment - Herbie Dental Clinic</title>
        <meta
          name="description"
          content="Schedule your dental appointment at Herbie Dental Clinic. Easy online booking available."
        />
      </Helmet>

      <section className="appointment-hero">
        <div className="hero-content">
          <h1>Book Your Appointment</h1>
          <p className="lead">
            Schedule your visit with our experienced dental professionals
          </p>
        </div>
      </section>

      <div className="container">
        <AppointmentForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          preSelectedService={preSelectedService}
          onDateSelect={setSelectedDate}
          onTimeSelect={setSelectedTime}
        />
      </div>
    </div>
  );
};

export default Appointments;
