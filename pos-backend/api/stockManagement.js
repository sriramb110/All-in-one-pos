const express = require("express");
const jwt = require("jsonwebtoken");
const { Product, Stock } = require("../models/stockModels"); 

const router = express.Router();

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


      const product = await Product.findById(id); 
      if (product) {
        product.stock += inward;
        await product.save();
      } else {
        console.log("Product not found for ID:", id);
      }
    }

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

router.get("/inward", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }

    // Fetch all inward stock records for the given business
    const stockRecords = await Stock.find({ businessName });

    // Prepare enriched stock data with product names and calculate totals
    const enrichedStock = await Promise.all(
      stockRecords.map(async (record) => {
        const enrichedInward = await Promise.all(
          record.StockInward.map(async (item) => {
            const product = await Product.findById(item.id);

            return {
              ...item,
              productName: product ? product.productName : "Unknown Product",
            };
          })
        );

        const totalInward = enrichedInward.reduce((sum, item) => sum + item.inward, 0);
        const totalBuyPrice = enrichedInward.reduce((sum, item) => sum + item.buyprice, 0);

        return {
          ...record.toObject(),
          StockInward: enrichedInward,
          totalInward,
          totalBuyPrice,
        };
      })
    );

    // Sort records by total inward quantity in descending order
    const sortedStock = enrichedStock.sort((a, b) => b.totalInward - a.totalInward);

    res.status(200).json(sortedStock);
  } catch (error) {
    console.error("Error fetching stock inward records:", error);
    res.status(500).json({
      error: "An error occurred while fetching stock inward records.",
    });
  }
});

router.get("/outward", authenticateToken, async(req, res)=>{
  try{
    const businessName = req.user.business;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }

    const stockRecords = await Stock.find({ businessName });
  }catch(error){

  }
});



module.exports = router;
