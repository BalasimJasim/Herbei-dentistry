export const getAppointmentConfirmationTemplate = (appointment) => {
  const date = new Date(appointment.dateTime).toLocaleDateString()
  const time = new Date(appointment.dateTime).toLocaleTimeString()

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4CAF50; text-align: center;">Appointment Confirmation</h1>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h2>Dear ${appointment.patient.firstName},</h2>
        <p>Your appointment has been confirmed for:</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Service:</strong> ${appointment.service}</p>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Location:</strong><br>
        Herbie Dental Clinic<br>
        123 Dental Street<br>
        City, State 12345</p>
      </div>

      <div style="margin-top: 20px; padding: 20px; border-top: 1px solid #eee;">
        <p>Need to reschedule? Please call us at (555) 123-4567 or reply to this email.</p>
      </div>
    </div>
  `
} 