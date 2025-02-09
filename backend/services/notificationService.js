import { sendEmail } from "../utils/email.js";
import { sendSMS } from "../utils/sendSMS.js";

export const sendAppointmentNotifications = async (appointment) => {
  try {
    console.log("Starting notification process for appointment:", {
      email: appointment.email,
      phone: appointment.phone,
      dateTime: appointment.dateTime,
      firstName: appointment.firstName,
      service: appointment.service,
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">Appointment Confirmation</h1>
              <p style="color: #4B5563; font-size: 16px;">Thank you for choosing Herbie Dental</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 18px; color: #1F2937; margin-bottom: 20px;">Dear ${
                appointment.firstName
              },</p>
              <p style="color: #4B5563; margin-bottom: 20px;">Your appointment has been successfully scheduled. Here are your appointment details:</p>
              
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 10px 0;"><strong>Date and Time:</strong> ${appointmentDate}</p>
                <p style="margin: 10px 0;"><strong>Service:</strong> ${
                  appointment.service
                }</p>
                ${
                  appointment.notes
                    ? `<p style="margin: 10px 0;"><strong>Notes:</strong> ${appointment.notes}</p>`
                    : ""
                }
              </div>
            </div>

            <div style="margin-top: 20px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 10px;">Important Information</h2>
              <ul style="color: #4B5563; padding-left: 20px;">
                <li>Please arrive 10 minutes before your appointment time</li>
                <li>Bring any relevant medical records or x-rays</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Phone: (555) 123-4567 | Email: contact@herbiedental.com</p>
            </div>
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
        message: `Hi ${appointment.firstName}, your ${appointment.service} appointment at Herbie Dental is confirmed for ${appointmentDate}. Please arrive 10 minutes early. Questions? Call (555) 123-4567.`,
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
