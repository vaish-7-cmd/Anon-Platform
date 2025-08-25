const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  story: { type: String, required: true },
  media: { type: String },
  createdAt: { type: Date, default: Date.now },
  replies: [
    {
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Confession', confessionSchema);
