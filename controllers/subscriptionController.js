const Business = require('../models/Business');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const paystackRequest = require('../config/paystack');
const { sendSubscriptionActivatedEmail } = require('../utils/notifications'); // 🔔 ADDED

const PLANS = {
  basic:   { price: 2000,  features: ['Listed in search', '3 photos', 'Basic profile'] },
  pro:     { price: 5000,  features: ['Featured listing', '10 photos', 'WhatsApp button', 'Priority search'] },
  premium: { price: 10000, features: ['Top featured', 'Unlimited photos', 'Analytics', 'Verified badge'] },
};

// GET /api/subscription/plans
exports.getPlans = async (req, res) => {
  const plans = Object.entries(PLANS).map(([name, val]) => ({ name, ...val }));
  res.json({ plans });
};

// POST /api/subscription/pay
exports.initiatePay = async (req, res, next) => {
  try {
    const { plan, businessId } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const reference = `BRC_${Date.now()}_${req.user._id}`;
    const data = await paystackRequest('POST', '/transaction/initialize', {
      email: req.user.email,
      amount: PLANS[plan].price * 100,
      reference,
      callback_url: `${process.env.BACKEND_URL}/api/subscription/verify/${reference}`,
      metadata: { plan, businessId, userId: req.user._id },
    });

    await Subscription.create({
      business: businessId, vendor: req.user._id,
      plan, amount: PLANS[plan].price, reference, status: 'pending',
    });

    res.json({ paymentLink: data.data.authorization_url, reference });
  } catch (error) { next(error); }
};

// GET /api/subscription/verify/:reference
exports.verifyPayment = async (req, res, next) => {
  try {
    const data = await paystackRequest('GET', `/transaction/verify/${req.params.reference}`);
    if (data.data.status !== 'success') return res.status(400).json({ message: 'Payment not successful' });

    const sub = await Subscription.findOne({ reference: req.params.reference });
    if (!sub) return res.status(404).json({ message: 'Subscription record not found' });

    sub.status = 'active';
    sub.startDate = new Date();
    sub.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await sub.save();

    const business = await Business.findByIdAndUpdate(
      sub.business,
      {
        subscriptionPlan: sub.plan,
        isFeatured: sub.plan === 'pro' || sub.plan === 'premium',
      },
      { new: true }
    );

    // 🔔 Notify vendor their subscription is now active (non-blocking)
    const vendor = await User.findById(sub.vendor);
    if (vendor && business) {
      sendSubscriptionActivatedEmail(vendor, business, sub).catch((err) =>
        console.error('Subscription activation email failed:', err)
      );
    }

    res.json({ message: 'Payment verified. Subscription activated!', sub });
  } catch (error) { next(error); }
};

// GET /api/subscription/status
exports.getStatus = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return res.status(404).json({ message: 'No business profile found' });

    const sub = await Subscription.findOne({ business: business._id, status: 'active' }).sort({ createdAt: -1 });
    if (!sub) return res.json({ plan: 'free', status: 'inactive' });

    const daysRemaining = Math.ceil((sub.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
    res.json({ plan: sub.plan, expiryDate: sub.expiryDate, daysRemaining, status: sub.status });
  } catch (error) { next(error); }
};