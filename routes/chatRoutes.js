const express = require('express');
const router = express.Router();
const Message = require('../model/Message');

// Send a message
router.post('/send', async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  try {
    const message = new Message({ senderId, receiverId, text });
    await message.save();
    res.status(200).json({ status: 'success', message });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get chat between two users
router.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort('timestamp');
    res.status(200).json({ status: 'success', data: messages });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
