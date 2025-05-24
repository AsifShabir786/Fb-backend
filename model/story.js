const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mediaUrl: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('story', storySchema);
