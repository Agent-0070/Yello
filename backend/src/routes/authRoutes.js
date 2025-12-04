const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation 
} = require('../middleware/authValidation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);

module.exports = router;