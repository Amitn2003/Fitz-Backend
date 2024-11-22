const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { getWorkoutVolume, getMuscleGroupInsights } = require('../controllers/progressController');

router.get('/volume', authenticateUser, getWorkoutVolume);
router.get('/muscle-insights', authenticateUser, getMuscleGroupInsights);

// Add more routes for other progress tracking features

module.exports = router;

