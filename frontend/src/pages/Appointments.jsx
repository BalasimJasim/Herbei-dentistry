import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm'
import styles from "./Appointments.module.css";

const Appointments = () => {
  const [searchParams] = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const preSelectedService = searchParams.get('service')

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  return (
    <div className="appointments-page">
      <Helmet>
        <title>Book Appointment - Herbie Dental Clinic</title>
        <meta
          name="description"
          content="Schedule your dental appointment at Herbie Dental Clinic. Easy online booking available."
        />
      </Helmet>

      <section className={styles.appointmentHero}>
        <div className={styles.heroContent}>
          <h1>Book Your Appointment</h1>
          <p className={styles.lead}>
            Schedule your visit with our experienced dental professionals
          </p>
        </div>
      </section>

      <section className="appointment-content">
        <div className="booking-container">
          <AppointmentForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            preSelectedService={preSelectedService}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
          />
        </div>
      </section>
    </div>
  );
}

export default Appointments 