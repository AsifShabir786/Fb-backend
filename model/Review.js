const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketPlace', required: true }, // ✅ Fixed
  userName: { type: String, required: true },
  productId: { type: String, required: true },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
