const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    pageName: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String, default: null },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    memberCount: { type: Number, default: 0 },
}, { timestamps: true });

const Group = mongoose.model('Media', groupSchema);
module.exports = Group;
