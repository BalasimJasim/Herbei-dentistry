export const validateCredentials = () => {
  const required = {
    email: ["EMAIL_USER", "EMAIL_PASSWORD"],
    twilio: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
  };

  const missing = {
    email: required.email.filter((key) => !process.env[key]),
    twilio: required.twilio.filter((key) => !process.env[key]),
  };

  if (missing.email.length > 0) {
    console.error("Missing email credentials:", missing.email);
  }

  if (missing.twilio.length > 0) {
    console.error("Missing Twilio credentials:", missing.twilio);
  }

  return {
    email: missing.email.length === 0,
    twilio: missing.twilio.length === 0,
  };
};
