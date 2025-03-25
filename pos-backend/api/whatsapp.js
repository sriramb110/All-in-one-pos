const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { to, template_name, language_code } = req.body;

    if (!to || !template_name || !language_code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await axios({
      url: "https://graph.facebook.com/v22.0/553164264554910/messages",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: template_name,
          language: {
            code: language_code,
          },
        },
      }),
    });

    res
      .status(200)
      .json({ message: "WhatsApp message sent!", response: response.data });
  } catch (error) {
    console.error(
      "WhatsApp API Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Error sending WhatsApp message",
        error: error.response ? error.response.data : error.message,
      });
  }
});

module.exports = router;
