const express = require('express');
const router = express.Router();

// Import controller
const Randomaization = require('../Controller/Randamization.js');

// Support both POST and GET for convenience
router.get('/GetStockData/:id', Randomaization.getStockData);
router.post('/GetStockData/:id', Randomaization.getStockData);

module.exports = router;