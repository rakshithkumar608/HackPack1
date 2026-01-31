const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/AuthMiddleware');
const WatchlistController = require('../Controller/WatchlistController');

// Get user's watchlist with stock data
router.get('/', protect, WatchlistController.getWatchlist);

// Get available stocks to add
router.get('/available', protect, WatchlistController.getAvailableStocks);

// Add stock to watchlist
router.post('/add', protect, WatchlistController.addToWatchlist);

// Remove stock from watchlist
router.delete('/remove/:symbol', protect, WatchlistController.removeFromWatchlist);

module.exports = router;
