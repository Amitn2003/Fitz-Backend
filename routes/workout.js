const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { logWorkout, getAllWorkouts, getWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');

router.post('/', authenticateUser, logWorkout);
router.get('/', authenticateUser, getAllWorkouts);
router.get('/:id', authenticateUser, getWorkout);
router.put('/:id', authenticateUser, updateWorkout);
router.delete('/:id', authenticateUser, deleteWorkout);

module.exports = router;

