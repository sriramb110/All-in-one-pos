require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

// Function to get access token
const getAccessToken = async () => {
  try {
    console.log("🔎 Requesting Access Token...");

    const tokenUrl = `${process.env.VF_SANDBOX_URL}/oauth2/v1/token`;
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(tokenUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.CONSUMER_KEY, 
        password: process.env.CONSUMER_SECRET, 
      },
    });

    console.log("✅ Access Token Received!");
    return response.data.access_token;
  } catch (error) {
    console.error(
      "❌ Error Getting Token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get access token");
  }
};

// Function to send SMS
const sendSMS = async (recipient, message) => {
  try {
    const accessToken = await getAccessToken(); 
    const smsUrl = `https://${process.env.CUSTOMER_ID}/api/smsmessaging/v1/outbound/${process.env.SENDER_ADDRESS}/requests`;
    if (!recipient.startsWith("tel:")) {
      recipient = `tel:${recipient}`;
    }

    const payload = {
      outboundSMSMessageRequest: {
        address: [recipient],
        senderAddress: process.env.SENDER_ID,
        outboundSMSTextMessage: { message },
        clientCorrelator: Date.now().toString(),
        receiptRequest: {
          callbackData: "debug",
          notifyURL: process.env.NOTIFY_URL || "https://webhook.site/YOUR_ID",
        },
        senderName: process.env.SENDER_ID,
      },
    };

    // console.log("📩 Sending SMS to:", recipient);
    // console.log("🔗 API Endpoint:", smsUrl);
    // console.log("📜 Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(smsUrl, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        "Content-Type": "application/json",
      },
    });

    console.log("✅ SMS Sent Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error Sending SMS:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send SMS");
  }
};

const sendSmsWithToken = async (to, message) => {
  try {
    const token = await getAccessToken();
    if (token) {
      return await sendSMS(token, to, message);
    }
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
  }
};
module.exports = { getAccessToken, sendSMS , sendSmsWithToken};

