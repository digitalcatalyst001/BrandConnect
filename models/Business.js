const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName:    { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  category:        { type: String, required: true },
  location:        { type: String, required: true },
  phone:           { type: String, required: true },
  whatsapp:        { type: String },
  instagram:       { type: String },
  services:        [{ type: String }],
  photos:          [{ type: String }],
  subscriptionPlan:{ type: String, enum: ['free', 'basic', 'pro', 'premium'], default: 'free' },
  isFeatured:      { type: Boolean, default: false },
  isSuspended:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);