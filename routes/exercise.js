const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise,approveExercise } = require('../controllers/exerciseController');

router.post('/', authenticateUser, authorizeAdmin, createExercise);
router.get('/', authenticateUser, getAllExercises);
router.get('/:id', authenticateUser, getExercise);
router.put('/:id', authenticateUser, authorizeAdmin, updateExercise);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteExercise);
router.patch('/:id/approve', authenticateUser, authorizeAdmin, approveExercise);


module.exports = router;

