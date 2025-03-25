require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const signup = require('./api/signup');
const login = require('./api/login');
const sendEmail = require('./api/mail');
const category = require('./api/category');
const products = require('./api/products');
const customer = require('./api/customer')
const orders = require("./api/orders");
const ledger = require("./api/Ledger")
const stockRouter = require("./api/stockManagement")
const profile = require("./api/profile")
const bisnessProfile = require("./api/bisnessProfile")
const whatsapp = require("./api/whatsapp"); 
const {sendSmsWithToken} = require("./api/sendSMS")


const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT;

if (!mongoURI) {
  console.error("Error: MongoDB URI not set in environment variables");
  process.exit(1); 
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

app.get('/', (req, res) => res.send('Welcome'));

app.use('/api/signup', signup); 
app.use('/api/signin', login); 
app.use('/api/categories', category);
app.use('/api/products', products);
app.use('/api/customer', customer);
app.use("/api/order", orders);
app.use("/api/ledger", ledger);
app.use("/api/stockManagement", stockRouter);
app.use("/api/profile", profile); 
app.use("/api/bisnessProfile", bisnessProfile); 
app.use("/api/whatsappMsg", whatsapp);

// Send SMS API
app.post("/api/send-sms", async (req, res) => {
  try {
    const { recipient, message } = req.body;
    await sendSmsWithToken(recipient, message);
    res.json({ message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// Email Endpoint
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  sendEmail(to, subject, text)
    .then((info) => {
      console.log('Email sent successfully:', info.response);
      res.status(200).json({ message: 'Email sent successfully', info });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email', error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at ${process.env.BACKPORT}`);
});
