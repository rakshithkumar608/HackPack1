const User = require('../Schemas/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleLoginXp } = require('./GamificationController');


const LoginUser = async (req, res) => {
  try {
    console.log("Triggerd!!")
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'itsHackPack2026andwearecodinghere',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Award XP for login
    let xpData = { xpAwarded: 0, streak: 0, totalXp: 0 };
    try {
      xpData = await handleLoginXp(user._id);
    } catch (xpError) {
      console.error('XP award error:', xpError);
    }

    res.json({
      message: 'Login successful',
      token: token,
      xpAwarded: xpData.xpAwarded,
      loginStreak: xpData.streak,
      totalXp: xpData.totalXp,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: `Get user with ID: ${id}`, data: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      data: { 
        id: newUser._id,
        name: newUser.name,
        email: newUser.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  LoginUser,
  getUserById,
  SignUp,
};
