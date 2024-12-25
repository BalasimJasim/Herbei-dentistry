import nodemailer from 'nodemailer';

// Create transporter with Gmail settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
  logger: true, // Enable logging
});

export const testEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email credentials missing");
    }

    console.log("Testing email configuration with:", {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASSWORD?.length || 0,
      host: "smtp.gmail.com",
      port: 587,
    });

    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.warn("Email configuration warning:", error.message);
    return false;
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || "Herbie Dental",
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      text,
      html: html || text,
    };

    console.log("Attempting to send email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
    });
    return true;
  } catch (error) {
    console.error("Email Error Details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return false;
  }
}; 