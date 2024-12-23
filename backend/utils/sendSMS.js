import twilio from 'twilio';

const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  // Validate Twilio credentials
  if (!accountSid || !authToken || !phoneNumber) {
    console.error('Missing Twilio credentials');
    return null;
  }

  // Validate Account SID format
  if (!accountSid.startsWith('AC')) {
    console.error('Invalid Twilio Account SID format - must start with AC');
    return null;
  }

  // Validate phone number format
  if (!phoneNumber.startsWith('+')) {
    console.error('Invalid Twilio phone number format - must start with +');
    return null;
  }

  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    console.error('Failed to create Twilio client:', error);
    return null;
  }
};

// Test SMS configuration
export const testSMSConfig = async () => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log('SMS configuration incomplete - missing credentials');
      return false;
    }

    // Verify the phone number is valid
    const phoneNumber = await client.lookups.v2.phoneNumbers(process.env.TWILIO_PHONE_NUMBER).fetch();
    console.log('Twilio phone number verified:', phoneNumber.phoneNumber);
    return true;
  } catch (error) {
    console.error('SMS configuration error:', error);
    return false;
  }
};

// Send appointment confirmation SMS
export const sendAppointmentConfirmationSMS = async (appointment) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      throw new Error('Failed to initialize Twilio client - check credentials');
    }

    // Format phone number for international use
    let toPhoneNumber = appointment.patient.phone;
    
    // Remove all non-digit characters except '+'
    toPhoneNumber = toPhoneNumber.replace(/[^\d+]/g, '');
    
    // Add + if not present
    if (!toPhoneNumber.startsWith('+')) {
      toPhoneNumber = '+' + toPhoneNumber;
    }

    // Validate phone number length (international numbers are typically 10-15 digits)
    const digitCount = toPhoneNumber.replace(/\D/g, '').length;
    if (digitCount < 10 || digitCount > 15) {
      throw new Error(`Invalid phone number length: ${digitCount} digits`);
    }

    console.log('SMS Configuration:', {
      fromNumber: process.env.TWILIO_PHONE_NUMBER,
      toNumber: toPhoneNumber,
      accountSid: process.env.TWILIO_ACCOUNT_SID?.substring(0, 6) + '...',
      hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN
    });

    const message = await client.messages.create({
      body: `
Hello ${appointment.patient.firstName},

Your appointment at Herbie Dental Clinic has been confirmed for:
Date: ${new Date(appointment.dateTime).toLocaleDateString()}
Time: ${new Date(appointment.dateTime).toLocaleTimeString([], { 
  hour: '2-digit', 
  minute: '2-digit'
})}
Service: ${appointment.service}

Need to reschedule? Please call us at +380123456789.

Best regards,
Herbie Dental Clinic
      `,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber
    });

    console.log('SMS sent successfully:', message.sid);
    return { sent: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', {
      error: error.message,
      code: error.code,
      moreInfo: error.moreInfo,
      phoneNumber: toPhoneNumber
    });
    return { 
      sent: false, 
      error: error.message,
      details: {
        code: error.code,
        status: error.status,
        moreInfo: error.moreInfo
      }
    };
  }
};

// Send appointment reminder SMS
export const sendAppointmentReminderSMS = async (appointment) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      throw new Error('Failed to initialize Twilio client');
    }

    // Format phone number same as confirmation SMS
    let toPhoneNumber = appointment.patient.phone;
    toPhoneNumber = toPhoneNumber.replace(/[^\d+]/g, '');
    if (!toPhoneNumber.startsWith('+')) {
      toPhoneNumber = '+' + toPhoneNumber;
    }

    const message = await client.messages.create({
      body: `
Reminder: You have an appointment at Herbie Dental Clinic tomorrow at ${new Date(appointment.dateTime).toLocaleTimeString()}.

Need to reschedule? Please call us at +380123456789.

Best regards,
Herbie Dental Clinic
      `,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber
    });

    console.log('Reminder SMS sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('Reminder SMS sending failed:', error);
    return false;
  }
}; 