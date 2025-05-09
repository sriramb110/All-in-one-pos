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
  date: { type: Date, required: true },
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
    const { Customerdata, payment, orderList, date, orderId, totalPrice } =
      req.body;
    const businessName = req.user.business;
    if (
      !Customerdata ||
      !payment ||
      !orderList ||
      !date ||
      !orderId ||
      !totalPrice ||
      !businessName
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const formattedDate = new Date(date)
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .reverse()
      .join("-");

    const order = new Orders({
      Customerdata,
      payment,
      orderList,
      date: new Date(date),
      Date: formattedDate,
      orderId,
      totalPrice,
      businessName,
    });
    const savedOrder = await order.save();

    for (const item of orderList) {
      const { orderQty, ids } = item;

      if (!ids || orderQty == null) continue;

      const product = await Product.findById(ids.ProductId);
      if (product) {
        product.stock -= orderQty;
        await product.save();
      } else {
        console.log("Product not found for ID:", ids.ProductId);
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

router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 29);

    const aggregateData = async (fromDate) => {
      return await Orders.aggregate([
        {
          $match: {
            businessName,
            date: {
              $gte: new Date(fromDate),
              $lt: new Date(today.getTime() + 86400000),
            },
          },
        },
        {
          $group: {
            _id: null,
            orderCount: { $sum: 1 },
            totalDiscount: { $sum: "$payment.discount" },
            totalProductSales: { $sum: { $sum: "$orderList.orderQty" } },
            totalBalance: {
              $sum: {
                $subtract: [
                  "$totalPrice",
                  { $add: ["$payment.discount", "$payment.receivedPrice"] },
                ],
              },
            },
          },
        },
      ]);
    };

    const todayData = (await aggregateData(today))[0] || {
      orderCount: 0,
      totalDiscount: 0,
      totalProductSales: 0,
      totalBalance: 0,
    };

    const last7DaysData = (await aggregateData(last7Days))[0] || {
      orderCount: 0,
      totalDiscount: 0,
      totalProductSales: 0,
      totalBalance: 0,
    };

    const last30DaysData = (await aggregateData(last30Days))[0] || {
      orderCount: 0,
      totalDiscount: 0,
      totalProductSales: 0,
      totalBalance: 0,
    };

    res.json({
      today: todayData,
      last7Days: last7DaysData,
      last30Days: last30DaysData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/outward", authenticateToken, async (req, res) => {
  try {
    const businessName = req.user.business;
    const { from, to } = req.query;

    if (!businessName) {
      return res.status(400).json({ error: "Missing business name in token." });
    }
    if (!from || !to) {
      return res.status(400).json({ error: "Missing date range in query." });
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);

    

    const ordersRecords = await Orders.find({
      businessName,
      date: {
        $gte: from,
        $lte: to,
      },
    });

    if (!ordersRecords.length) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified range." });
    }

    const productSales = ordersRecords
      .flatMap((order) => order.orderList) 
      .reduce((acc, { ProductName, orderQty, Amount }) => {
        if (!acc[ProductName]) {
          acc[ProductName] = { ProductName, totalQty: 0, totalAmount: 0 };
        }
        acc[ProductName].totalQty += orderQty;
        acc[ProductName].totalAmount = Amount; 

        return acc;
      }, {});

    const consolidatedProducts = Object.values(productSales);

    res.status(200).json(consolidatedProducts);
  } catch (error) {
    console.error("Error in outward endpoint:", error.message);
    res.status(500).json({ error: "Internal server error." });
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

module.exports = router;
