import { sendEmail } from "../utils/email.js";
import { sendSMS } from "../utils/sendSMS.js";

export const sendAppointmentNotifications = async (appointment) => {
  try {
    console.log("Starting notification process for appointment:", {
      email: appointment.email,
      phone: appointment.phone,
      dateTime: appointment.dateTime,
      firstName: appointment.firstName,
      service: appointment.serviceId,
    });

    const appointmentDate = new Date(appointment.dateTime).toLocaleString();
    let emailSent = false;
    let smsSent = false;

    // Send email if email is provided
    if (appointment.email) {
      console.log("Attempting to send email notification...");
      const emailContent = {
        to: appointment.email,
        subject: "Appointment Confirmation - Herbie Dental",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Appointment Confirmation</h1>
            <p>Dear ${appointment.firstName},</p>
            <p>Your appointment has been successfully scheduled.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Date and Time:</strong> ${appointmentDate}</p>
            </div>
            <p>Thank you for choosing Herbie Dental. We look forward to seeing you!</p>
          </div>
        `,
      };

      emailSent = await sendEmail(emailContent);
      console.log("Email notification status:", emailSent ? "sent" : "failed");
    }

    // Send SMS if phone number is provided
    if (appointment.phone) {
      console.log("Attempting to send SMS notification...");
      const smsContent = {
        to: appointment.phone,
        message: `Hi ${appointment.firstName}, your appointment at Herbie Dental is confirmed for ${appointmentDate}. We look forward to seeing you!`,
      };

      smsSent = await sendSMS(smsContent);
      console.log("SMS notification status:", smsSent ? "sent" : "failed");
    }

    return {
      emailSent,
      smsSent,
    };
  } catch (error) {
    console.error("Error in sendAppointmentNotifications:", error);
    return {
      emailSent: false,
      smsSent: false,
      error: error.message,
    };
  }
};

export const scheduleReminders = async (appointment) => {
  // Implementation for scheduling reminders
  return true;
};

export const sendCancellationNotifications = async (appointment) => {
  try {
    console.log("Starting cancellation notification process for appointment:", {
      email: appointment.email,
      phone: appointment.phone,
      dateTime: appointment.dateTime,
    });

    const appointmentDate = new Date(appointment.dateTime).toLocaleString();
    let emailSent = false;
    let smsSent = false;

    // Send email if email is provided
    if (appointment.email) {
      const emailContent = {
        to: appointment.email,
        subject: "Appointment Cancellation - Herbie Dental",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Appointment Cancellation</h1>
            <p>Dear ${appointment.firstName},</p>
            <p>Your appointment has been cancelled as requested.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Cancelled Appointment Details:</strong></p>
              <p><strong>Date and Time:</strong> ${appointmentDate}</p>
            </div>
            <p>If you would like to schedule a new appointment, please visit our website.</p>
            <p>Thank you for choosing Herbie Dental.</p>
          </div>
        `,
      };

      emailSent = await sendEmail(emailContent);
      console.log(
        "Cancellation email notification status:",
        emailSent ? "sent" : "failed"
      );
    }

    // Send SMS if phone number is provided
    if (appointment.phone) {
      const smsContent = {
        to: appointment.phone,
        message: `Hi ${appointment.firstName}, your appointment at Herbie Dental for ${appointmentDate} has been cancelled. Visit our website to schedule a new appointment.`,
      };

      smsSent = await sendSMS(smsContent);
      console.log(
        "Cancellation SMS notification status:",
        smsSent ? "sent" : "failed"
      );
    }

    return {
      emailSent,
      smsSent,
    };
  } catch (error) {
    console.error("Error in sendCancellationNotifications:", error);
    return {
      emailSent: false,
      smsSent: false,
      error: error.message,
    };
  }
};
