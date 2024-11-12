require('dotenv').config(); // Load environment variables

const express = require('express');
const Joi = require('joi');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const sendEmail = require('./mail');
const jwt = require('jsonwebtoken');
const router = express.Router();

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(2).required(),
  dob: Joi.date().iso().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  businessName: Joi.string().min(2).required(),
  emailId: Joi.string().email().required(),
});

router.post('/', async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, name, dob, phoneNumber, businessName, emailId } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username }, { emailId }, { phoneNumber }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.emailId === emailId) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    }

    const newUser = new User({
      username,
      name,
      dob,
      phoneNumber,
      businessName,
      emailId,
    });

    // Generate a temporary token
    const token = jwt.sign({ username, emailId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    newUser.token = token;
    newUser.tokenExpiration = Date.now() + 3600000;

    await newUser.save();

    const emailSubject = 'Welcome! Please Confirm Your Email';
    const emailText = `Hello ${name},\n\nThank you for registering.`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #2590df; 
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please set your password by clicking the button below:</p>
      <a href="http://localhost:3000/Setpassword/${token}" class="button">Set Password</a>
      <p>Best Regards,<br>Your Team</p>
    </body>
    </html>
    `;

    await sendEmail(emailId, emailSubject, emailText, html);

    res.status(201).json({ message: 'User registered successfully! A confirmation email has been sent.' });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Password setting route with token verification
router.patch('/set-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ username: decoded.username });
    if (!user || user.token !== token || Date.now() > user.tokenExpiration) {
      return res.status(404).json({ message: 'User not found or token expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.token = undefined; 
    user.tokenExpiration = undefined; 
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
