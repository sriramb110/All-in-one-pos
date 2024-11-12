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

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Load environment variables
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3500;

// Check for required environment variables
if (!mongoURI) {
  console.error("Error: MongoDB URI not set in environment variables");
  process.exit(1); // Exit if required environment variables are missing
}

// Database connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if database connection fails
  });

// Routes
app.get('/', (req, res) => res.send('Welcome'));

// API Endpoints
app.use('/api/signup', signup); 
app.use('/api/signin', login); 
app.use('/api/categories', category);
app.use('/api/products', products);
app.use('/api/customer', customer);

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
  console.log(`Server is running at http://localhost:${port}`);
});
