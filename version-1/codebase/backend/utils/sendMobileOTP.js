require('dotenv').config(); // Load environment variables
const twilio = require('twilio');

// Create a reusable function to send OTP
const sendMobileOTP = async (otp, mobileNumber) => {
  try {
    // Your Twilio Account SID and Auth Token
    const accountSid = process.env.TWILIO_ACCOUNTSID;
    const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;

    // Create a Twilio client
    const client = twilio(accountSid, authToken);

    // Send the SMS
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_MOBILE_NUMBER,
      to: `+91${mobileNumber}`, // Modify as per your region code
    });

    console.log("OTP sent successfully:", message.sid);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error while sending OTP:", error.message);
    return { success: false, error: "Failed to send OTP" };
  }
};

module.exports = sendMobileOTP;
