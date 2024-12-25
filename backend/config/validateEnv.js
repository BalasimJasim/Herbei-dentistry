export const validateEnv = () => {
  // First, log raw values (length only for security)
  console.log("Raw ENV Values Check:", {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID?.length || 0,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN?.length || 0,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "missing",
  });

  const twilioVars = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  };

  // Detailed validation
  const validation = {
    NODE_ENV: process.env.NODE_ENV,
    TWILIO_VARS_PRESENT: {
      ACCOUNT_SID: {
        exists: !!twilioVars.accountSid,
        length: twilioVars.accountSid?.length,
        starts_with: twilioVars.accountSid?.substring(0, 2),
      },
      AUTH_TOKEN: {
        exists: !!twilioVars.authToken,
        length: twilioVars.authToken?.length,
      },
      PHONE_NUMBER: {
        exists: !!twilioVars.phoneNumber,
        valid_format: /^\+\d{10,}$/.test(twilioVars.phoneNumber),
      },
    },
  };

  console.log("Environment validation:", validation);

  return twilioVars;
};
