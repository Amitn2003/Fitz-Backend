const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
// const Exercise = require('../models/Exercise');
const { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise,approveExercise } = require('../controllers/exerciseController');
// const {isAdmin} = require('../middleware/auth')



router.post('/', authenticateUser, authorizeAdmin, createExercise);
router.get('/', getAllExercises);
router.get('/:id', getExercise);
router.put('/:id', authenticateUser, authorizeAdmin, updateExercise);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteExercise);
router.patch('/:id/approve', authenticateUser, authorizeAdmin, approveExercise);


module.exports = router;

