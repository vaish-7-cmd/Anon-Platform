const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    media: { type: String }, // file path for image/video
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
