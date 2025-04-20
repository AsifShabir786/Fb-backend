const Review = require('../model/Review');
const response = require('../utils/responceHandler');

// Create a new review
const addReview = async (req, res) => {
  try {
    const { listingId, userName, reviewText, productId } = req.body;

    if (!listingId || !userName || !reviewText || !productId) {
      return response(res, 400, 'All fields are required');
    }

    const review = new Review({ listingId, userName, reviewText, productId });
    await review.save();

    return response(res, 201, 'Review created successfully', review);
  } catch (err) {
    return response(res, 500, 'Error creating review', err.message);
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    return response(res, 200, 'Reviews fetched', reviews);
  } catch (err) {
    return response(res, 500, 'Error fetching reviews', err.message);
  }
};


module.exports = {
  addReview,
  getReviewsByProduct,
};
