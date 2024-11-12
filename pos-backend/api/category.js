// categoryRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Define a Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
});

categorySchema.index({ name: 1, businessName: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

// Create a router
const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const businessName = req.user.business; 
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }
  

  try {
    const existingCategory = await Category.findOne({ name, businessName });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists for this business.' });
    }
    
    const category = new Category({ name, businessName });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories (Protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Extract business name from the token
    const businessName = req.user.business;

    // Find categories based on the business name
    const categories = await Category.find({ businessName: businessName });

    // Respond with the filtered categories
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a category (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.sendStatus(404); // Not found
    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a category (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.sendStatus(404); // Not found
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;
