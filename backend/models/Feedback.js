const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
    maxlength: 240
  }
}, {
  timestamps: true
});

feedbackSchema.index({ pitch: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
