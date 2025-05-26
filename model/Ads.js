const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
  duration: { type: String, required: false }, // e.g., "60 days plan"
  budget: { type: Number, required: false },
  campaignType: { type: String, required: false }, // e.g., "Display"
  campaignName: { type: String, required: false },
  campaignDetails: { type: String, required: false },
  selectedTags: [{ type: String }], // e.g., ["Food Ads", "Products"]
mediaUrl: { type: String, default: null },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

const Ads = mongoose.model('Ads', adsSchema);
module.exports = Ads;
