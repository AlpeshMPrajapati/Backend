const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validationMiddleware');
const { signup, login } = require('../controllers/Auth');

// User registration route
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  // validateRequest,
  signup
);

// User login route
router.post('/login', login);

module.exports = router;
