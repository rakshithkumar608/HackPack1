require('dotenv').config()
const express = require('express');
const app = express();
const userRoutes = require('./Routes/UserRoutes');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err))


// Use routes with a base path
app.use('/api/users', userRoutes);


app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access: http://localhost:${PORT}`);
});
