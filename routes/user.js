const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

module.exports = router;

