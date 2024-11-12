const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  dob: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  businessName: {
    type: String,
    required: true,
    minlength: 2,
  },
  password: {
    type: String,
    minlength: 6,
  },
  emailId:{
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  token: { type: String },  
  tokenExpiration: { type: Date } 
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
