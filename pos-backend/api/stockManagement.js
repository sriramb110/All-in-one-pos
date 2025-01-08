const express = require("express");
const jwt = require("jsonwebtoken");
const { Product, Stock } = require("../models/stockModels"); // Import models

const router = express.Router();

// JWT Authentication middleware
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

// Route for adding stock
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { StockInward, Date, AgencyName } = req.body;
    const businessName = req.user.business;

    if (!AgencyName || !StockInward || !Date || !businessName) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const stock = new Stock({ StockInward, Date, AgencyName, businessName });
    const saveStock = await stock.save();

    for (const item of StockInward) {
      const { id, inward } = item;

      if (!id || inward == null) continue;

      console.log("Attempting to update stock for product ID:", id); 

      const product = await Product.findById(id); 
      if (product) {
        product.stock += inward;
        await product.save(); // Save updated product stock
        console.log(
          `Stock updated for product ID: ${id}, new stock: ${product.stock}`
        ); // Debug log
      } else {
        console.log("Product not found for ID:", id); // Debug log
      }
    }

    // Return success response
    res.status(201).json({
      message: "Stock saved successfully.",
      order: saveStock,
    });
  } catch (error) {
    console.error("Error saving stock or updating products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the stock." });
  }
});

module.exports = router;
