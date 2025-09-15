const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    name: String,
    role: String,
    email: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
