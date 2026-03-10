const express = require('express');
const router = express.Router();
const { searchBusinesses, getFeatured, getCategories } = require('../controllers/searchController');

router.get('/', searchBusinesses);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);

module.exports = router;