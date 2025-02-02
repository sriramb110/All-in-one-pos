require("dotenv").config(); // Load environment variables
const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const BusinessProfile = require("../models/user.js");
// const User = require("../models/user.js");


const router = express.Router();

// ✅ Validation schema for business profile
const businessProfileSchema = Joi.object({
  businessName: Joi.string().required(),
  businessType: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  establishedYear: Joi.number().required(),
  ownerName: Joi.string().required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().required(),
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

// ✅ Create or Update Business Profile (POST)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { error } = businessProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    console.log(req.user);

    const { business } = req.user;
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    let businessProfile = await BusinessProfile.findOne({
      businessName: business,
    });

    if (!businessProfile) {
      businessProfile = new BusinessProfile({
        ...req.body,
        businessName: business,
      });
    } else {
      Object.assign(businessProfile, req.body);
    }

    await businessProfile.save();

    res.json({
      message: "Business Profile saved successfully",
      businessProfile,
    });
  } catch (err) {
    console.error("Error updating business profile:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    const { error } = businessProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { business } = req.user;
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    let businessProfile = await BusinessProfile.findOne({ businessName: business });

    if (!businessProfile) {
      return res.status(404).json({ message: "Business Profile not found" });
    }

    // Replace the entire profile with the new data
    businessProfile = Object.assign(businessProfile, req.body);

    await businessProfile.save();

    res.json({ message: "Business Profile replaced successfully", businessProfile });
  } catch (err) {
    console.error("Error replacing business profile:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


router.patch("/", authenticateToken, async (req, res) => {
  try {
    const { business } = req.user;
    if (!business) {
      return res.status(400).json({ message: "Business name is required." });
    }

    let businessProfile = await BusinessProfile.findOne({ businessName: business });

    if (!businessProfile) {
      return res.status(404).json({ message: "Business Profile not found" });
    }

    // Update only the provided fields
    Object.keys(req.body).forEach((key) => {
      if (businessProfile[key] !== undefined) {
        businessProfile[key] = req.body[key];
      }
    });

    await businessProfile.save();

    res.json({ message: "Business Profile updated successfully", businessProfile });
  } catch (err) {
    console.error("Error updating business profile (PATCH):", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


module.exports = router;
