const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Product } = require("../models/stockModels");

const OrdersDetails = new mongoose.Schema({
  Customerdata: { type: Object, required: true },
  payment: { type: Object, required: true },
  orderList: { type: [Object], required: true },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true },
  Date: { type: String, required: true },
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
    const { Customerdata, payment, orderList, Date, orderId, totalPrice } =
    req.body;
    const businessName = req.user.business;
    if (
      !Customerdata ||
      !payment ||
      !orderList ||
      !Date ||
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
      Date,
      orderId,
      totalPrice,
      businessName,
    });
    const savedOrder = await order.save();

    for (const item of orderList) {
      const {orderQty,ids} = item

      if(!ids || orderQty == null) continue;

      const product = await Product.findById(ids.ProductId);
      if (product) {
        product.stock -= orderQty;
        await product.save(); 
      } else {
        console.log("Product not found for ID:", ids.ProductId); // Debug log
      }
    }
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
      businessName: businessName,
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
    console.error("Error fetching orders:", error);
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
    const order = await Orders.findOne({
      _id: req.params.id,
      businessName: businessName,
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

router.get("/outward", authenticateToken, async (req, res) => {
  try {
    const { businessName } = req.user;
    const { from, to } = req.query;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }
    if (!from || !to) {
      return res.status(400).json({ error: "Missing date range in query." });
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(from) || !dateRegex.test(to)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use MM/DD/YYYY." });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const ordersRecords = await Orders.find({
      businessName,
      Date: {
        $gte: fromDate.toISOString(),
        $lte: toDate.toISOString(),
      },
    });

    if (!ordersRecords.length) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified range." });
    }

    const enrichedOrders = ordersRecords.map((order) => ({
      ...order.toObject(),
      totalQuantity: order.orderList.reduce(
        (sum, item) => sum + (item.orderQty || 0),
        0
      ),
      totalPrice: order.totalPrice || 0,
    }));

    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("Error in outward endpoint:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});






module.exports = router;
