const express = require('express');
const { register, login, getProfile, changePassword, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
