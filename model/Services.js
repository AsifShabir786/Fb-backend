const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: [{ type: String, required: false }],
  condition: { type: String, required: false },
  imageUrl:[{ type: String, default: null }],
  sellerName: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  serviceType: { type: String, required: true },


  
  PhoneNumber: { type: String, required: true },

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: true },

  listingDate: { type: Date, default: Date.now }
}, { timestamps: true });

const MarketPlace = mongoose.model('Services', listingSchema);
module.exports = MarketPlace;
