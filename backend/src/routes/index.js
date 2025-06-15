const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const feedbackRoutes = require('./feedbackRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const feeRoutes = require('./feeRoutes');
const userRoutes = require('./userRoutes');
const residentRoutes = require('./residentRoutes');
const apartmentRoutes = require('./apartmentRoutes');

const base = 'api/v1';

// Auth routes
router.use(`/${base}/auth`, authRoutes);

// Admin routes
router.use(`/${base}/admin`, adminRoutes);

// Feedback routes
router.use(`/${base}/feedback`, feedbackRoutes);

// Vehicle routes
router.use(`/${base}/vehicles`, vehicleRoutes);

// Invoice routes
router.use(`/${base}/invoices`, invoiceRoutes);

// Fee routes
router.use(`/${base}/fees`, feeRoutes);

// User routes
router.use(`/${base}/users`, userRoutes);

// Resident routes
router.use(`/${base}/residents`, residentRoutes);

// Apartment routes
router.use(`/${base}/apartments`, apartmentRoutes);

module.exports = router;