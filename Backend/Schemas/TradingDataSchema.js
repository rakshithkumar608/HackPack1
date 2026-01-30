const mongoose = require('mongoose');


const dailyPriceSchema = new mongoose.Schema({
  open: String,
  high: String,
  low: String,
  close: String,
  volume: String,
  // Also accept numbered keys from API response
  '1. open': String,
  '2. high': String,
  '3. low': String,
  '4. close': String,
  '5. volume': String
}, { _id: false });

const tradingDataSchema = new mongoose.Schema({
  metaData: {
    information: {
      type: String,
      default: 'Daily Prices (open, high, low, close) and Volumes'
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    lastRefreshed: {
      type: Date,
      required: true
    },
    outputSize: {
      type: String,
      enum: ['Compact', 'Full'],
      default: 'Compact'
    },
    timeZone: {
      type: String,
      default: 'US/Eastern'
    }
  },

  timeSeries: {
    type: Map,
    of: dailyPriceSchema,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
tradingDataSchema.index({ 'metaData.symbol': 1, 'createdAt': -1 });

// Pre-save middleware to update the updatedAt field
tradingDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});



module.exports = mongoose.model('TradingData', tradingDataSchema);
