const express = require('express');
const router = express.Router();
const { protect, vendorOnly } = require('../middleware/authMiddleware');
const { getPlans, initiatePay, verifyPayment, getStatus } = require('../controllers/subscriptionController');

router.get('/plans', getPlans);
router.post('/pay', protect, vendorOnly, initiatePay);
router.get('/verify/:reference', verifyPayment);
router.get('/status', protect, vendorOnly, getStatus);

module.exports = router;