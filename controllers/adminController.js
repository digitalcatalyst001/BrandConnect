const User = require('../models/User');
const Business = require('../models/Business');
const Subscription = require('../models/Subscription');
const { sendSuspensionEmail } = require('../utils/notifications'); // 🔔 ADDED

// GET /api/admin/vendors
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json({ vendors });
  } catch (error) { next(error); }
};

// GET /api/admin/revenue
exports.getRevenue = async (req, res, next) => {
  try {
    const active = await Subscription.find({ status: 'active' });
    const expired = await Subscription.find({ status: 'expired' });
    const totalRevenue = await Subscription.aggregate([
      { $match: { status: { $in: ['active', 'expired'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      activeSubscriptions: active.length,
      expiredSubscriptions: expired.length,
    });
  } catch (error) { next(error); }
};

// PUT /api/admin/suspend/:vendorId
exports.suspendVendor = async (req, res, next) => {
  try {
    const business = await Business.findOneAndUpdate(
      { owner: req.params.vendorId },
      { isSuspended: true },
      { new: true }
    );
    if (!business) return res.status(404).json({ message: 'Vendor business not found' });

    // 🔔 Notify vendor their account has been suspended (non-blocking)
    const vendor = await User.findById(req.params.vendorId);
    if (vendor) {
      sendSuspensionEmail(vendor, business).catch((err) =>
        console.error('Suspension email failed:', err)
      );
    }

    res.json({ message: 'Vendor suspended successfully' });
  } catch (error) { next(error); }
};