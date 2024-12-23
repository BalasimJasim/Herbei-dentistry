import nodemailer from 'nodemailer'
import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

// Email transporter
let emailTransporter = null
try {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
} catch (error) {
  console.error('Failed to initialize email transporter:', error)
}

// Twilio client
let twilioClient = null
try {
  if (process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  } else {
    console.warn('Invalid or missing Twilio credentials')
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error)
}

// Email templates
const emailTemplates = {
  'appointment-confirmation': (data) => ({
    subject: 'Your Appointment Confirmation',
    html: `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${data.firstName} ${data.lastName},</p>
      <p>Your appointment has been confirmed for:</p>
      <p>Date: ${data.date}</p>
      <p>Time: ${data.time}</p>
      <p>Service: ${data.service}</p>
      <p>Thank you for choosing our dental clinic!</p>
    `
  }),
  'appointment-reminder': (data) => ({
    subject: 'Appointment Reminder',
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${data.firstName},</p>
      <p>This is a reminder of your upcoming appointment:</p>
      <p>Date: ${data.date}</p>
      <p>Time: ${data.time}</p>
      <p>Please arrive 10 minutes before your scheduled time.</p>
    `
  })
}

// SMS templates
const smsTemplates = {
  'appointment-confirmation': (data) => `
    Hi ${data.firstName}! Your appointment is confirmed for ${data.date} at ${data.time}. 
    Reply Y to confirm or call us to reschedule.
  `,
  'appointment-reminder': (data) => `
    Hi ${data.firstName}! Reminder: Your appointment is tomorrow at ${data.time}.
    Please arrive 10 minutes early.
  `
}

export const sendAppointmentNotifications = {
  // Send email notification
  sendEmail: async ({ to, template, data }) => {
    if (!emailTransporter) {
      console.warn('Email service not configured')
      return false
    }

    try {
      const emailContent = emailTemplates[template](data)
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: emailContent.subject,
        html: emailContent.html
      })
      console.log('Email sent successfully to:', to)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  },

  // Send SMS notification
  sendSMS: async ({ to, template, data }) => {
    if (!twilioClient) {
      console.warn('SMS service not configured')
      return false
    }

    try {
      const message = smsTemplates[template](data)
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      })
      console.log('SMS sent successfully to:', to)
      return true
    } catch (error) {
      console.error('Failed to send SMS:', error)
      return false
    }
  }
}

// Schedule reminders
export const scheduleReminders = async (appointment) => {
  try {
    const reminderTime = new Date(appointment.dateTime)
    reminderTime.setHours(reminderTime.getHours() - 24) // 24 hours before appointment
    const delay = reminderTime.getTime() - Date.now()

    // Only schedule if the reminder time is in the future
    if (delay > 0) {
      // Schedule email reminder
      setTimeout(async () => {
        await sendAppointmentNotifications.sendEmail({
          to: appointment.email,
          template: 'appointment-reminder',
          data: {
            firstName: appointment.firstName,
            date: appointment.dateTime.toLocaleDateString(),
            time: appointment.dateTime.toLocaleTimeString()
          }
        })
      }, delay)

      // Schedule SMS reminder
      setTimeout(async () => {
        await sendAppointmentNotifications.sendSMS({
          to: appointment.phone,
          template: 'appointment-reminder',
          data: {
            firstName: appointment.firstName,
            date: appointment.dateTime.toLocaleDateString(),
            time: appointment.dateTime.toLocaleTimeString()
          }
        })
      }, delay)
    }
  } catch (error) {
    console.error('Error scheduling reminders:', error)
  }
}

export default sendAppointmentNotifications 