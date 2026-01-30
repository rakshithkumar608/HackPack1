const express = require('express');
const router = express.Router();

// Import controller
const Randomaization = require('../Controller/Randamization.js');

// Support both POST and GET for convenience
router.get('/GetforRELIANCE/:id', Randomaization.RELIANCE);
router.post('/GetforRELIANCE/:id', Randomaization.RELIANCE);

module.exports = router;