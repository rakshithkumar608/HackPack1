const express = require('express');
const router = express.Router();
const AIController = require('../Controller/AIController');

// GET /api/ai/analysis/:symbol - Get AI analysis for a company
router.get('/analysis/:symbol', AIController.getCompanyAnalysis);

// POST /api/ai/chat - Behavioral analysis for trading intentions
router.post('/chat', AIController.behavioralAnalysis);

module.exports = router;

