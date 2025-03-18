const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const router = express.Router();
const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => {
  console.log("Scan this QR code with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.on("message", async (msg) => {
  try {
    if (msg.from !== "status@broadcast") {
      const contact = await msg.getContact();
      console.log(contact, msg.body);
    }
  } catch (error) {
    console.log(error);
  }
});

// Example API route for sending messages
router.post("/send", async (req, res) => {
  try {
    const { number, message } = req.body;
    console.log("object", number, message);
    await client.sendMessage(number, message);
    console.log("work")
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the WhatsApp client
client.initialize();

module.exports = router; // Export router
