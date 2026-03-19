const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  business:   { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  vendor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:       { type: String, enum: ['basic', 'pro', 'premium'], required: true },
  amount:     { type: Number, required: true },
  reference:  { type: String, required: true, unique: true },
  status:     { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
  startDate:  { type: Date },
  expiryDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);