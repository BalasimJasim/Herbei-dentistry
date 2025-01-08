import twilio from 'twilio';

// Create Twilio client with explicit credentials
const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();

  console.log("Twilio Credentials Check:", {
    accountSid: accountSid
      ? `${accountSid.slice(0, 4)}...${accountSid.slice(-4)}`
      : "missing",
    authToken: authToken
      ? `${authToken.slice(0, 4)}...${authToken.slice(-4)}`
      : "missing",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "missing",
  });

  if (!accountSid || !authToken) {
    console.error("Missing Twilio credentials:", {
      accountSid: accountSid ? "present" : "missing",
      authToken: authToken ? "present" : "missing",
      phoneNumber: process.env.TWILIO_PHONE_NUMBER ? "present" : "missing",
    });
    return null;
  }

  try {
    const client = twilio(accountSid, authToken);
    console.log("Twilio client created successfully");
    return client;
  } catch (error) {
    console.error("Error creating Twilio client:", error);
    return null;
  }
};

let client = null;

export const initializeTwilioClient = () => {
  if (!client) {
    console.log("Initializing new Twilio client...");
    client = createTwilioClient();
  }
  return client;
};

export const testSMSConfig = async () => {
  try {
    console.log("Testing SMS configuration...");
    client = initializeTwilioClient();
    if (!client) {
      throw new Error("Twilio client not initialized");
    }

    const account = await client.api
      .accounts(process.env.TWILIO_ACCOUNT_SID)
      .fetch();
    console.log("Twilio account verified:", account.friendlyName);
    return true;
  } catch (error) {
    console.error("SMS configuration error:", error.message);
    return false;
  }
};

export const sendSMS = async ({ to, message }) => {
  try {
    console.log("Initializing SMS send process...");
    client = initializeTwilioClient();
    if (!client) {
      console.error("SMS send error: Twilio client not initialized");
      return false;
    }

    // Format phone number
    const formattedTo = to.replace(/[^\d+]/g, "");
    const fullNumber = formattedTo.startsWith("+")
      ? formattedTo
      : `+${formattedTo}`;

    console.log("Sending SMS to:", fullNumber);

    const result = await client.messages.create({
      body: message,
      to: fullNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("SMS sent successfully:", result.sid);
    return true;
  } catch (error) {
    console.error("SMS Error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      twilioError: error.twilioError || false,
    });
    return false;
  }
}; 