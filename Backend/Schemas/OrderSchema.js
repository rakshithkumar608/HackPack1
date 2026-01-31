const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderQuantity: {
    type: Number,
    required: [true, 'Please provide order quantity'],
    min: [1, 'Order quantity must be at least 1']
  },

  symbol: {
    type: String,
    required: [true, 'Please provide stock symbol'],
    uppercase: true,
    trim: true
  },

  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },

  totalAmount: {
    type: Number,
    default: function() {
      return this.orderQuantity * this.price;
    }
  },

  orderType: {
    type: String,
    enum: ['BUY', 'SELL'],
    default: 'BUY'
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

// Pre-save middleware to calculate totalAmount and update updatedAt
orderSchema.pre('save', function(next) {
  this.totalAmount = this.orderQuantity * this.price;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
