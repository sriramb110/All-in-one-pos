
require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const router = express.Router();

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const payload = { userId: user._id, username: user.username, emailId: user.emailId,business: user.businessName };    

    const token = jwt.sign(payload, process.env.JWT_SECRET,  { expiresIn: 8 * 60 * 60 });

    res.status(200).json({
      message: 'Login successful',  
      token, 
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
