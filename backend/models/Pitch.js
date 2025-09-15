const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  demoLink: {
    type: String,
    required: true
  },
  deckUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['fintech', 'health', 'ai', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pitch', pitchSchema);
