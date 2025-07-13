const express = require('express');
const router = express.Router();
const Ads = require('../model/Adsadshort');
const authMiddleware = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');

// ✅ Create Ad
router.post('/ads', async (req, res) => {
  try {
    const {
      duration,
      budget,
      campaignType,
      campaignName,
      campaignDetails,
      createdBy,
      mediaUrl,
      selectedTags
    } = req.body;

    // Check required fields
    // if (
    //   !duration ||
    //   !budget ||
    //   !campaignType ||
    //   !campaignName ||
    //   !campaignDetails ||
    //   !createdBy
    // ) {
    //   return res.status(400).json({ message: 'Missing required fields' });
    // }
    const newAd = new Ads({
      duration,
      budget,
      campaignType,
      campaignName,
      campaignDetails,
      selectedTags: Array.isArray(selectedTags) ? selectedTags : [selectedTags],
      createdBy: createdBy,
      mediaUrl: mediaUrl || null
    });
console.log(newAd)

    await newAd.save();
    res.status(201).json({ message: 'Ad created successfully', ad: newAd });
  } catch (err) {
    console.error('Create Ad Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});



// ✅ Get All Ads
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ads.find().populate('createdBy', 'firstName lastName  email');
    res.status(200).json(ads);
  } catch (err) {
    console.error('Fetch Ads Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Delete Ad
router.delete('/ads/:id', async (req, res) => {
  try {
    const ad = await Ads.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Optional: check if user is creator
    if (ad.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this ad' });
    }

    await ad.deleteOne();
    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (err) {
    console.error('Delete Ad Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Update Ad
router.put('/ads/:id',  multerMiddleware.single('media'), async (req, res) => {
  try {
    const {
      duration,
      budget,
      campaignType,
      campaignName,
      campaignDetails
    } = req.body;

    const selectedTags = req.body['selectedTags[]'] || [];

    const updatedFields = {
      duration,
      budget,
      campaignType,
      campaignName,
      campaignDetails,
      selectedTags: Array.isArray(selectedTags) ? selectedTags : [selectedTags],
    };

    if (req.file?.path) {
      updatedFields.mediaUrl = req.file.path;
    }

    const updatedAd = await Ads.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json({ message: 'Ad updated successfully', ad: updatedAd });
  } catch (err) {
    console.error('Update Ad Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
