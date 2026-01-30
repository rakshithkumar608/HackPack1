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

  level: {
    type: Number,
    default: 1,
    min: 1
  },

  reflectionStreak: {
    type: Number,
    default: 0,
    min: [0, 'Reflection streak cannot be negative']
  },

  loginStreak: {
    type: Number,
    default: 0,
    min: 0
  },

  lastLoginDate: {
    type: Date,
    default: null
  },

  lastReflectionDate: {
    type: Date,
    default: null
  },

  totalTrades: {
    type: Number,
    default: 0
  },

  profitableTrades: {
    type: Number,
    default: 0
  },

  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],

  behavior_history: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate level from XP
xpSchema.methods.calculateLevel = function() {
  // Every 100 XP = 1 level
  return Math.floor(this.xpPoints / 100) + 1;
};

// Get level name
xpSchema.methods.getLevelName = function() {
  const level = this.level;
  if (level >= 50) return 'Legend';
  if (level >= 30) return 'Master';
  if (level >= 20) return 'Expert';
  if (level >= 10) return 'Investor';
  if (level >= 5) return 'Trader';
  return 'Rookie';
};

// Pre-save middleware
xpSchema.pre('save', function(next) {
  this.level = this.calculateLevel();
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Xp', xpSchema);
