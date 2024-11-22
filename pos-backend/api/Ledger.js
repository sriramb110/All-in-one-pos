const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();
const orders = require('./orders')
const axios = require("axios");

const LedgerSchema = new mongoose.Schema({
  CustomerPhoneNumber: { type: String, required: true },
  OrderId: { type: Array, required: true },
  OSB: { type: String, required: true },
  businessName: { type: String, required: true },
});

LedgerSchema.index({ CustomerPhoneNumber: 1 });

const Ledger = mongoose.model("Ledger", LedgerSchema);

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

// POST route to add or update ledger
router.post("/", authenticateToken, async (req, res) => {
  const { CustomerPhoneNumber, OrderId, OSB } = req.body;
  const businessName = req.user.business;

  if (!CustomerPhoneNumber || !OrderId || !OSB) {
    return res
      .status(400)
      .json({ error: "CustomerPhoneNumber, OrderId, and OSB are required." });
  }

  try {
    const existingLedger = await Ledger.findOne({ CustomerPhoneNumber });

    if (existingLedger) {
      existingLedger.OrderId = [
        ...new Set([...existingLedger.OrderId, OrderId]),
      ];
      existingLedger.OSB = OSB;
      await existingLedger.save();

      return res.status(200).json({
        message: "Ledger updated successfully.",
        data: existingLedger,
      });
    }

    const newLedger = new Ledger({
      CustomerPhoneNumber,
      OrderId,
      businessName,
      OSB,
    });
    await newLedger.save();

    return res
      .status(201)
      .json({ message: "Ledger created successfully.", data: newLedger });
  } catch (error) {
    console.error("Error saving ledger:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:CustomerPhoneNumber", authenticateToken, async (req, res) => {
  const { CustomerPhoneNumber } = req.params;

  try {
    const ledger = await Ledger.findOne({
      CustomerPhoneNumber
    });

    if (!ledger) {
      return res
        .status(404)
        .json({ error: "No outstanding balance or ledger found." });
    }

    if (ledger.OrderId && ledger.OrderId.length > 0) {
      const orderDetails = await Promise.all(
        ledger.OrderId.map(async (id) => {
          try {
            const response = await axios.get(
              `${process.env.BACKPORT}/api/order/${id}`,
              {
                headers: { Authorization: req.header("Authorization") },
              }
            );
            const orderDetails = response.data.order;
            const orderPayment = orderDetails.payment
            const orderDate = orderDetails.Date_Time;
            const orderPrice = orderDetails.totalPrice;
            const orderId = orderDetails.orderId;

            return { orderPayment, orderDate, orderId, orderPrice }; 
          } catch (error) {
            if (error.response?.status === 404) {
              console.warn(`Order with ID: ${id} not found.`);
              return { orderId: id, error: "Order not found." };
            }
            console.error(
              `Error fetching order with ID: ${id}:`,
              error.message
            );
            return { orderId: id, error: "Error fetching order details." };
          }
        })
      );

      return res.status(200).json({
        message: "Ledger found.",
        ledger: ledger,
        orderDetails: orderDetails,
      });
    }

    // If no OrderId exists
    return res
      .status(200)
      .json({ message: "No orders found in ledger.", ledger });
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/osb/:CustomerPhoneNumber", authenticateToken, async (req, res) => {
  const { CustomerPhoneNumber } = req.params;

  try {
    const ledger = await Ledger.findOne({
      CustomerPhoneNumber,
    });

    if (!ledger) {
      return res
        .status(404)
        .json({ error: "No outstanding balance or ledger found." });
    }

    if (ledger.OrderId && ledger.OrderId.length > 0) {

      return res.status(200).json({
        message: "Ledger found.",
        ledger: ledger.OSB,
      });
    }

    // If no OrderId exists
    return res
      .status(200)
      .json({ message: "No orders found in ledger.", ledger });
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
