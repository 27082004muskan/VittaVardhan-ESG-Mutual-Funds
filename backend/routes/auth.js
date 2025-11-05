const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Private routes (require authentication)
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logoutUser);

module.exports = router;
