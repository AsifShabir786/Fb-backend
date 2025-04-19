const MarketPlace = require('../model/MarketPlace');
const response = require('../utils/responceHandler');

// CREATE Listing
const createListing = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      condition,
      imageUrl,
      sellerName,description,
      PhoneNumber,
      sellerId
    } = req.body;

    const newListing = new MarketPlace({
      title,
      price,
      category,
      condition,
      imageUrl,
      sellerName,description,PhoneNumber,
      sellerId
    });

    await newListing.save();
    return response(res, 201, 'Listing created successfully', newListing);
  } catch (err) {
    return response(res, 500, 'Error creating listing', err.message);
  }
};

// READ all Listings
const getAllListings = async (req, res) => {
  try {
    const listings = await MarketPlace.find();
    return response(res, 200, 'All listings fetched', listings);
  } catch (err) {
    return response(res, 500, 'Error fetching listings', err.message);
  }
};

// READ one Listing
const getListingById = async (req, res) => {
  try {
    const listing = await MarketPlace.findById(req.params.id);
    if (!listing) return response(res, 404, 'Listing not found');
    return response(res, 200, 'Listing fetched', listing);
  } catch (err) {
    return response(res, 500, 'Error fetching listing', err.message);
  }
};

// UPDATE Listing
const updateListing = async (req, res) => {
  try {
    const updated = await MarketPlace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return response(res, 404, 'Listing not found');
    return response(res, 200, 'Listing updated successfully', updated);
  } catch (err) {
    return response(res, 500, 'Error updating listing', err.message);
  }
};

// DELETE Listing
const deleteListing = async (req, res) => {
  try {
    const deleted = await MarketPlace.findByIdAndDelete(req.params.id);
    if (!deleted) return response(res, 404, 'Listing not found');
    return response(res, 200, 'Listing deleted successfully', deleted);
  } catch (err) {
    return response(res, 500, 'Error deleting listing', err.message);
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
};
