const express = require('express');
const { authenticateUser } = require('../middleware/auth.js');
const { 
  getDailyStats, 
  getWorkoutStreak, 
  getExerciseFrequency, 
  getProgressOverTime 
} = require('../controllers/analyticsController.js');

const router = express.Router();

router.get('/daily-stats', authenticateUser, getDailyStats);
router.get('/workout-streak', authenticateUser, getWorkoutStreak);
router.get('/exercise-frequency', authenticateUser, getExerciseFrequency);
router.get('/progress/:exerciseId', authenticateUser, getProgressOverTime);

module.exports = router;

