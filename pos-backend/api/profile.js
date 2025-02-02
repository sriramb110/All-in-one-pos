require("dotenv").config(); // Load environment variables
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.js");

const router = express.Router();

// ✅ Validation schema for profile
const profileSchema = Joi.object({
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow("").optional(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  country: Joi.string().required(),
  businessProfile: Joi.string().required(),
  bio: Joi.string().allow("").optional(),
});

// ✅ Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
};

// ✅ Get Profile by Business Name (GET)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { business } = req.user; // Get business name from JWT

    if (!business) {
      return res.status(400).json({ message: "Invalid business name" });
    }

    const user = await User.findOne({ businessName: business }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});


// ✅ Create or Update Profile (POST)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { error } = profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { business } = req.user; // Business name from JWT
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    const user = await User.findOne({ businessName: business });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    Object.assign(user, req.body);
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Replace Entire Profile (PUT)
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { error } = profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { business } = req.user;
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    const user = await User.findOne({ businessName: business });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(user, req.body);
    await user.save();

    res.json({ message: "Profile replaced successfully", user });
  } catch (err) {
    console.error("Error replacing profile:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Partial Update Profile (PATCH)
router.patch("/", authenticateToken, async (req, res) => {
  try {
    const { business } = req.user;
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    const user = await User.findOne({ businessName: business });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the provided fields
    Object.keys(req.body).forEach((key) => {
      if (
        [
          "addressLine1",
          "addressLine2",
          "state",
          "district",
          "country",
          "businessProfile",
          "bio",
        ].includes(key)
      ) {
        user[key] = req.body[key];
      }
    });

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile (PATCH):", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
