const express = require('express');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getListingsBySellerId
} = require('../controllers/MarketPlaceController');
const { createCheckoutSession, createPaymentIntent } = require('../controllers/StripeController');

const router = express.Router();

router.post('/marketplace', createListing);
router.get('/marketplace', getAllListings);
router.get('/marketplace/:id', getListingById);
router.get('/ListingsBySellerId/:sellerId', getListingsBySellerId);

router.put('/marketplace/:id', updateListing);
router.delete('/marketplace/:id', deleteListing);
router.post('/create-checkout-session', createPaymentIntent);

module.exports = router;
