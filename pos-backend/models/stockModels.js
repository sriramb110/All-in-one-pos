const mongoose = require("mongoose");

// Stock Schema for storing stock details
const StockDetails = new mongoose.Schema({
  AgencyName: { type: String, required: true },
  Date: { type: String, required: true },
  StockInward: { type: [Object], required: true },
  businessName: { type: String, required: true },
});

// Product Schema for storing product details
const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  categoryType: { type: String, required: true },
  businessName: { type: String, required: true },
  amount: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const OrdersDetails = new mongoose.Schema({
  Customerdata: { type: Object, required: true },
  payment: { type: Object, required: true },
  orderList: { type: [Object], required: true },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true },
  Date_Time: { type: String, required: true },
  businessName: { type: String, required: true },
});

// Avoid re-defining the model if it already exists
const Product =  mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Stock = mongoose.models.Stock || mongoose.model("Stock", StockDetails);
const Orders = mongoose.models.Stock || mongoose.model("Orders", OrdersDetails);

module.exports = { Product, Stock, Orders };
