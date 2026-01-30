const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password by default
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  xpProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Xp',
    default: null
  },
  
    orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]


});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {                                                 
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('User', userSchema);
