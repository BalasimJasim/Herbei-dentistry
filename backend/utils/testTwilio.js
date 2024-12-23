import { testSMSConfig } from './sendSMS.js';

const testTwilioSetup = async () => {
  try {
    const result = await testSMSConfig();
    console.log('Twilio test result:', result);
  } catch (error) {
    console.error('Twilio test failed:', error);
  }
};

testTwilioSetup(); 