const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllVendors, getRevenue, suspendVendor } = require('../controllers/adminController');

router.get('/vendors', protect, adminOnly, getAllVendors);
router.get('/revenue', protect, adminOnly, getRevenue);
router.put('/suspend/:vendorId', protect, adminOnly, suspendVendor);

module.exports = router;