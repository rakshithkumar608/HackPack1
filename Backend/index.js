require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./Routes/UserRoutes');
const DataRoutes = require('./Routes/DataAccess');
const OrderRoutes = require('./Routes/OrderRoutes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3001",

    "http://localhost:3000"



  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Use routes with a base path
app.use('/api/users', userRoutes);
app.use('/api/trading', DataRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/ai', require('./Routes/AIRoutes'));
app.use('/api/gamification', require('./Routes/GamificationRoutes'));



app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});


// MongoDB connection and server startup
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  WARNING: MONGODB_URI not found in .env file');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`Access: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
