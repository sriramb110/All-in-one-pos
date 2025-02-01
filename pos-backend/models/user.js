const mongoose = require("mongoose");

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
  emailId: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  token: { type: String },
  tokenExpiration: { type: Date },

  // Add missing profile fields
  addressLine1: { type: String, default: "" },
  addressLine2: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  country: { type: String, default: "" },
  businessProfile: { type: String, default: "" },
  bio: { type: String, default: "" },
  businessName: { type: String, required: true, unique: true },
  businessType: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  ownerName: { type: String, required: true },
  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
