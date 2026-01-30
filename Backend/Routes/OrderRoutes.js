const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/OrderController');

// POST /api/orders/buy
router.post('/buy', OrderController.buyOrder);

module.exports = router;