const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const adsSchema = new mongoose.Schema(
  {
    duration: { type: String },
    budget: { type: Number },
    campaignType: { type: String },
    campaignName: { type: String },
    campaignDetails: { type: String },
    selectedTags: [{ type: String }],
    mediaUrl: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isLiked: { type: Boolean, default: false },
    comments: [commentSchema], // ✅ Add this line
  },
  { timestamps: true }
);

const Ads = mongoose.model('Ads', adsSchema);
module.exports = Ads;
