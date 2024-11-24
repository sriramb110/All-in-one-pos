const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const OrdersDetails = new mongoose.Schema({
  Customerdata: { type: Object, required: true },
  payment: { type: Object, required: true },
  orderList: { type: [Object], required: true },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true },
  Date_Time: { type: String, required: true },
  businessName: { type: String, required: true },
});

OrdersDetails.index({ "Customerdata.email": 1 });

const Orders = mongoose.model("Orders", OrdersDetails);

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
    const { Customerdata, payment, orderList, Date_Time, orderId, totalPrice } =
    req.body;
    const businessName = req.user.business;
    if (
      !Customerdata ||
      !payment ||
      !orderList ||
      !Date_Time ||
      !orderId ||
      !totalPrice ||
      !businessName
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const order = new Orders({
      Customerdata,
      payment,
      orderList,
      Date_Time,
      orderId,
      totalPrice,
      businessName,
    });
    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business; 

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }

    // Fetch orders by business name
    const orders = await Orders.find({
      "Customerdata.businessName": businessName,
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this business." });
    }

    res.status(200).json({
      message: "Orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the orders." });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }

    // Fetch a specific order by ID and ensure it belongs to the business
    const order = await Orders.findOne({
      _id: req.params.id,
      "Customerdata.businessName": businessName,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order fetched successfully.",
      order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the order." });
  }
});

router.patch("/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment } = req.body;

    if (!payment) {
      return res.status(400).json({ error: "Payment data is required." });
    }

    const updatedOrder = await Orders.findOneAndUpdate(
      { orderId, businessName: req.user.business },
      { $set: { payment } },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      message: "Payment updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the payment." });
  }
});




module.exports = router;
