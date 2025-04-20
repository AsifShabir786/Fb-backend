const express = require('express');
const { addReview, getReviewsByProduct } = require('../controllers/ReviewController');

const router = express.Router();

router.post('/reviews', addReview);
router.get('/reviews/product/:productId', getReviewsByProduct);

module.exports = router;
