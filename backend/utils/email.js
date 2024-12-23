import nodemailer from 'nodemailer';

// Create transporter with Gmail settings
const createTransporter = () => {
  // Only create transporter if credentials are available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not configured. Email functionality disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return false;
    }

    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.warn('Email configuration warning:', error.message);
    return false;
  }
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (appointment) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email sending skipped - no configuration');
      return false;
    }

    const message = {
      from: `"Herbie Dental Clinic" <${process.env.EMAIL_USER}>`,
      to: appointment.patient.email,
      subject: 'Appointment Confirmation - Herbie Dental Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50; text-align: center;">Appointment Confirmation</h1>
          <p>Dear ${appointment.patient.firstName},</p>
          <p>Your appointment has been confirmed for:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(appointment.dateTime).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Optional: Add a function to send appointment reminders
export const sendAppointmentReminder = async (appointment) => {
  try {
    const message = {
      from: `"Herbie Dental Clinic" <${process.env.EMAIL_USER}>`,
      to: appointment.patient.email,
      subject: 'Appointment Reminder - Herbie Dental Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50; text-align: center;">Appointment Reminder</h1>
          <p>Dear ${appointment.patient.firstName},</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Tomorrow at:</strong> ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
          </div>
          <p>We look forward to seeing you!</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Need to reschedule? Please call us at (555) 123-4567
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(message);
    console.log('Reminder email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Reminder email sending failed:', error);
    return false;
  }
}; 