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
// Add comment to a story
router.post('/api/stories/:id/comments', async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ error: 'userId and text are required' });
  }

  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const newComment = {
      user: userId,
      text,
      time: new Date(),
    };

    story.comments.push(newComment);
    await story.save();

    res.status(200).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment', detail: err.message });
  }
});

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
router.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate('userId', 'username profilePicture firstName lastName')
      .populate('comments.user', 'username profilePicture firstName lastName');

    const grouped = {};

    stories.forEach(story => {
      const userId = story.userId._id.toString(); // Convert ObjectId to string for object keys

      if (!grouped[userId]) {
        grouped[userId] = {
          user: {
            _id: story.userId._id,
            username: story.userId.username,
            firstName: story.userId.firstName,
            lastName: story.userId.lastName,
            profilePicture: story.userId.profilePicture || '',
          },
          stories: [],
        };
      }

      grouped[userId].stories.push({
        _id: story._id,
        mediaUrl: story.mediaUrl,
        // text: story.text, // if your story has no text, remove this
        createdAt: story.createdAt,
        comments: story.comments.map(comment => ({
          _id: comment._id,
          text: comment.text,
          time: comment.time,
          user: {
            _id: comment.user?._id,
            username: comment.user?.username,
            firstName: comment.user?.firstName,
            lastName: comment.user?.lastName,
            profilePicture: comment.user?.profilePicture || '',
          },
        })),
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});


// Fetch all active stories grouped by user
// router.get('/api/stories', async (req, res) => {
//   try {
//     const stories = await Story.find({ expiresAt: { $gt: new Date() } }).populate('userId', 'username profilePicture firstName profilePicture name lastName'); // Include additional fields

//     const grouped = {};
// console.log(stories)
//     stories.forEach((story) => {
//       const userId = story.userId._id;
//       if (!grouped[userId]) {
//         grouped[userId] = {
//           user: {
//             name: story.userId.username,
//             _id: story.userId._id,

//             profilePicture: story.userId.profilePicture || '',
//           },
//           stories: [],
//         };
//       }
//       grouped[userId].stories.push({
//         mediaUrl: story.mediaUrl,
//                 _id: story.id, // 👈 Include the unique story ID here
//   comments: story.comments || [], // 👈 Add this line to include comments

//         text: story.text,
//         createdAt: story.createdAt,
//       });
//     });

//     res.json(Object.values(grouped));
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch stories' });
//   }
// });
// Update a story
router.put('/api/stories/:id', async (req, res) => {
  try {
    const { heartId } = req.body;
    const updateFields = {};

    if (heartId) {
      // Push to likes array only if not already liked
      const story = await Story.findById(req.params.id);
      if (!story) return res.status(404).json({ error: 'Story not found' });

      if (!story.likes.includes(heartId)) {
        story.likes.push(heartId);
        await story.save();
        return res.json({ success: true, message: 'Story liked', story });
      } else {
        return res.json({ success: false, message: 'Already liked', story });
      }
    }

    res.status(400).json({ error: 'heartId required to like' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story', detail: err.message });
  }
});

// Delete a story
router.delete('/api/stories/:id', async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);

    if (!deletedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story', detail: err.message });
  }
});

module.exports = router;
