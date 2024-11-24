const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();
const orders = require("./orders");
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
    // Fetch the ledger entry
    const ledger = await Ledger.findOne({ CustomerPhoneNumber });

    if (!ledger) {
      return res
        .status(404)
        .json({ error: "No outstanding balance or ledger found." });
    }

    let orderDetails = [];
    if (ledger.OrderId && ledger.OrderId.length > 0) {
      orderDetails = await Promise.all(
        ledger.OrderId.map(async (id) => {
          try {
            const response = await axios.get(
              `${process.env.BACKPORT}/api/order/${id}`,
              {
                headers: { Authorization: req.header("Authorization") },
              }
            );

            const { payment, Date_Time, totalPrice, orderId } =
              response.data.order;
            return {
              orderPayment: payment,
              orderDate: Date_Time,
              orderPrice: totalPrice,
              orderId,
            };
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
    }

    let customerDetails;
    try {
      const response = await axios.get(
        `${process.env.BACKPORT}/api/customer/ledger/${CustomerPhoneNumber}`,
        {
          headers: { Authorization: req.header("Authorization") },
        }
      );
      customerDetails = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(
          `Customer with phone number ${CustomerPhoneNumber} not found.`
        );
        customerDetails = "Customer not found.";
      } else {
        console.error(
          `Error fetching customer details for phone number ${CustomerPhoneNumber}:`,
          error.message
        );
        customerDetails = "Error fetching customer details.";
      }
    }

    return res.status(200).json({
      message: "Ledger found.",
      ledger,
      orderDetails,
      customerDetails,
    });
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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const ledgers = await Ledger.find({ businessName: req.user.business });

    if (!ledgers || ledgers.length === 0) {
      return res
        .status(404)
        .json({ error: "No outstanding balance or ledger found." });
    }

    const detailedLedgers = await Promise.all(
      ledgers.map(async (ledger) => {
        try {
          const response = await axios.get(
            `${process.env.BACKPORT}/api/customer/ledger/${ledger.CustomerPhoneNumber}`,
            {
              headers: { Authorization: req.header("Authorization") },
            }
          );

          return {
            ...ledger.toObject(),
            customerDetails: response.data,
          };
        } catch (error) {
          if (error.response?.status === 404) {
            console.warn(
              `Customer with phone number ${ledger.CustomerPhoneNumber} not found.`
            );
            return {
              ...ledger.toObject(),
              customerDetails: "Customer not found.",
            };
          }

          console.error(
            `Error fetching customer details for phone number ${ledger.CustomerPhoneNumber}:`,
            error.message
          );
          return {
            ...ledger.toObject(),
            customerDetails: "Error fetching customer details.",
          };
        }
      })
    );

    return res.status(200).json({
      message: "Ledgers found.",
      data: detailedLedgers,
    });
  } catch (error) {
    console.error("Error fetching ledger details:", error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.patch("/:CustomerPhoneNumber", authenticateToken, async (req, res) => {
  const { CustomerPhoneNumber } = req.params; // Extract CustomerPhoneNumber from URL
  const { OSB } = req.body; // Get OSB from the request body

  // Validate the OSB field
  if (OSB === undefined) {
    return res
      .status(400)
      .json({ error: "OSB is required in the request body." });
  }

  try {
    // Find the ledger by CustomerPhoneNumber
    const existingLedger = await Ledger.findOne({ CustomerPhoneNumber });

    // Check if the ledger exists
    if (!existingLedger) {
      return res.status(404).json({
        error: "Ledger not found for the provided CustomerPhoneNumber.",
      });
    }

    // Update the OSB field
    existingLedger.OSB = OSB;
    await existingLedger.save();

    return res.status(200).json({
      message: "Ledger OSB updated successfully.",
      data: existingLedger,
    });
  } catch (error) {
    console.error("Error updating ledger OSB:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
