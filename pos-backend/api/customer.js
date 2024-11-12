const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailId: { type: String },
    businessName: { type: String, required: true }
});

CustomerSchema.index({ customerName: 1, phoneNumber: 1, emailId: 1 }, { unique: true });

const Customer = mongoose.model('Customer', CustomerSchema);

const router = express.Router();

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
    const { customerName, phoneNumber, emailId } = req.body;
    const businessName = req.user.business;

    if (!customerName || !phoneNumber) {
        return res.status(400).json({ error: 'Customer Name and phoneNumber are required.' });
    }

    try {
        const customer = new Customer({ customerName, phoneNumber, emailId, businessName });
        await customer.save();
        res.status(201).json({ message: 'Customer added successfully', customer });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.phoneNumber) {
            res.status(400).json({ error: 'Customer with the same details already exists.' });
        } else {
            res.status(500).json({ error: 'Server error: ' + error.message });
        }
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const customers = await Customer.find({ businessName: req.user.business });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        // Optionally, you could also verify if the customer belongs to the authenticated user's business
        if (customer.businessName !== req.user.business) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.delete('/', authenticateToken, async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'A non-empty array of IDs is required.' });
    }

    try {
        const result = await Customer.deleteMany({
            _id: { $in: ids },
            businessName: req.user.business // Assuming customers are associated with a business
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No customers found to delete or not authorized.' });
        }

        res.status(200).json({ message: `${result.deletedCount} customers deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { customerName, phoneNumber, emailId } = req.body;
    const businessName = req.user.business;

    if (!customerName && !phoneNumber && !emailId) {
        return res.status(400).json({ error: 'At least one field is required to update.' });
    }

    try {
        const duplicateCustomer = await Customer.findOne({
            _id: { $ne: id },
            customerName,
            phoneNumber,
            emailId,
            businessName
        });

        if (duplicateCustomer) {
            return res.status(400).json({ error: 'A customer with these details already exists.' });
        }

        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: id, businessName },
            { $set: { customerName, phoneNumber, emailId } },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});



module.exports = router;
