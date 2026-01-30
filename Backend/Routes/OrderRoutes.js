const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/OrderController');
const { protect } = require('../Middleware/AuthMiddleware');

// POST /api/orders/buy - Protected route, gets userId from cookie
router.post('/buy', protect, OrderController.buyOrder);

// POST /api/orders/sell - Protected route, gets userId from cookie
router.post('/sell', protect, OrderController.sellOrder);

// GET /api/orders/balance - Get user's available balance
router.get('/balance', protect, OrderController.getBalance);

// GET /api/orders/holding/:symbol - Get shares owned for a symbol
router.get('/holding/:symbol', protect, OrderController.getHolding);

// GET /api/orders/portfolio - Protected route, gets userId from cookie
router.get('/portfolio', protect, OrderController.getPortfolio);

module.exports = router;