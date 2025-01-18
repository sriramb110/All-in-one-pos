const express = require("express");
const jwt = require("jsonwebtoken");
const { Product, Stock, Orders } = require("../models/stockModels"); 

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

router.get("/outward", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }

    // Extract date range from query parameters
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Missing 'from' or 'to' date in query parameters." });
    }

    // Parse dates and validate
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return res
        .status(400)
        .json({ error: "Invalid date format for 'from' or 'to'." });
    }

    // Ensure `toDate` includes the whole day
    toDate.setHours(23, 59, 59, 999);

    // Query the Orders collection with the date range and business name
    const ordersRecords = await Orders.find({
      businessName,
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    if (!ordersRecords.length) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified date range." });
    }

    // Enrich the orders data if needed
    const enrichedOrders = ordersRecords.map((order) => ({
      ...order.toObject(),
      totalQuantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    }));

    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("Error fetching outward orders:", error);
    res.status(500).json({
      error: "An error occurred while fetching outward orders.",
    });
  }
});




module.exports = router;
