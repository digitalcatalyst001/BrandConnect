const Business = require('../models/Business');
const Category = require('../models/Category');

// GET /api/search
exports.searchBusinesses = async (req, res, next) => {
  try {
    const { category, location, plan } = req.query;
    const query = { isSuspended: false };

    if (category) query.category = { $regex: category, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (plan === 'featured') query.isFeatured = true;

    const results = await Business.find(query).select('businessName category location photos isFeatured subscriptionPlan');
    res.json({ results, total: results.length });
  } catch (error) { next(error); }
};

// GET /api/search/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const featured = await Business.find({ isFeatured: true, isSuspended: false })
      .select('businessName category location photos subscriptionPlan');
    res.json({ featured });
  } catch (error) { next(error); }
};

// GET /api/search/categories
exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find();
    const categories = cats.length
      ? cats.map((c) => c.name)
      : ['Beauty', 'Food', 'Fashion', 'Photography', 'Tech', 'Health', 'Events'];
    res.json({ categories });
  } catch (error) { next(error); }
};