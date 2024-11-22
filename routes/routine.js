const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { createRoutine, getAllRoutines, getRoutine, updateRoutine, deleteRoutine } = require('../controllers/routineController');

router.post('/', authenticateUser, createRoutine);
router.get('/', authenticateUser, getAllRoutines);
router.get('/:id', authenticateUser, getRoutine);
router.put('/:id', authenticateUser, updateRoutine);
router.delete('/:id', authenticateUser, deleteRoutine);

module.exports = router;

