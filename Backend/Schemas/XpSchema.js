const mongoose = require('mongoose');

const xpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  xpPoints: {
    type: Number,
    default: 0,
    min: [0, 'XP points cannot be negative']
  },

  reflectionStreak: {
    type: Number,
    default: 0,
    min: [0, 'Reflection streak cannot be negative']
  },

  lastReflectionDate: {
    type: Date,
    default: null
  },

  behavior_history: {
    type: [String],
    default:[]
  }
});

// Pre-save middleware to update updatedAt
xpSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Xp', xpSchema);
