const express = require('express');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
} = require('../controllers/MarketPlaceController');

const router = express.Router();

router.post('/marketplace', createListing);
router.get('/marketplace', getAllListings);
router.get('/marketplace/:id', getListingById);
router.put('/marketplace/:id', updateListing);
router.delete('/marketplace/:id', deleteListing);

module.exports = router;
