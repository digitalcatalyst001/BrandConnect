const Business = require('../models/Business');
const { sendProfileCreatedEmail } = require('../utils/notifications'); // 🔔 ADDED

// POST /api/vendor/create-profile
exports.createProfile = async (req, res, next) => {
  try {
    const existing = await Business.findOne({ owner: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists. Use update instead.' });

    const photos = req.files ? req.files.map((f) => f.path) : [];
    const services = req.body.services ? JSON.parse(req.body.services) : [];

    const business = await Business.create({ ...req.body, services, photos, owner: req.user._id });

    // 🔔 Notify vendor their profile is now live (non-blocking)
    sendProfileCreatedEmail(req.user, business).catch((err) => console.error('Profile created email failed:', err));

    res.status(201).json({ business });
  } catch (error) { next(error); }
};

// GET /api/vendor/:id
exports.getProfile = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json({ business });
  } catch (error) { next(error); }
};

// PUT /api/vendor/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return res.status(404).json({ message: 'Business profile not found' });

    const photos = req.files?.length ? req.files.map((f) => f.path) : business.photos;
    const services = req.body.services ? JSON.parse(req.body.services) : business.services;

    Object.assign(business, req.body, { photos, services });
    await business.save();
    res.json({ business });
  } catch (error) { next(error); }
};

// DELETE /api/vendor/delete
exports.deleteProfile = async (req, res, next) => {
  try {
    await Business.findOneAndDelete({ owner: req.user._id });
    res.json({ message: 'Business deleted successfully' });
  } catch (error) { next(error); }
};