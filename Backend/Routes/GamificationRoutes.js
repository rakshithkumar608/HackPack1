const express = require('express');
const router = express.Router();
const GamificationController = require('../Controller/GamificationController');
const { protect } = require('../Middleware/AuthMiddleware');

// GET /api/gamification/stats - Get user's XP, level, achievements
router.get('/stats', protect, GamificationController.getStats);

// GET /api/gamification/leaderboard - Get top 10 users
router.get('/leaderboard', protect, GamificationController.getLeaderboard);

module.exports = router;
