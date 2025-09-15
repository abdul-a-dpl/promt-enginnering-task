const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pitch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pitch',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

voteSchema.index({ pitch: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
