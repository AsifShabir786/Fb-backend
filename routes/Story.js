const express = require('express');
const router = express.Router();
const Story = require('../model/story');
const User = require('../model/User');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for multer using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stories',
    resource_type: 'auto', // Handles both image and video
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage });

// Create story (image/video/text)
router.post('/api/stories', upload.single('media'), async (req, res) => {
  try {
    const { userId, text } = req.body;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const mediaUrl = req.file ? req.file.path : ''; // Cloudinary URL

    const newStory = new Story({
      userId,
      mediaUrl,
      text,
      expiresAt,
    });

    await newStory.save();
    res.status(201).json({ success: true, message: 'Story uploaded to Cloudinary' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
});

// Fetch all active stories grouped by user
router.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } }).populate('userId', 'username profilePicture firstName profilePicture name lastName'); // Include additional fields

    const grouped = {};

    stories.forEach((story) => {
      const userId = story.userId._id;
      if (!grouped[userId]) {
        grouped[userId] = {
          user: {
            name: story.userId.username,
            profilePicture: story.userId.profilePicture || '',
          },
          stories: [],
        };
      }
      grouped[userId].stories.push({
        mediaUrl: story.mediaUrl,
        text: story.text,
        createdAt: story.createdAt,
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

module.exports = router;
