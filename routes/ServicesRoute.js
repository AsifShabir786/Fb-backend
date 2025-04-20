const express = require('express');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
} = require('../controllers/ServicesController');
const { createCheckoutSession, createPaymentIntent } = require('../controllers/StripeController');

const router = express.Router();

router.post('/Services', createListing);
router.get('/Services', getAllListings);
router.get('/Services/:id', getListingById);
router.put('/Services/:id', updateListing);
router.delete('/Services/:id', deleteListing);
router.post('/create-checkout-session', createPaymentIntent);

module.exports = router;
