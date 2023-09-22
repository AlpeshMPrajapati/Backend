const express = require('express');
const router = express.Router();
const {addRepayment} = require('../controllers/repaymentController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validationMiddleware');

// Add a repayment for a loan route (requires authentication)
router.post(
  '/add/:loanId',
  [
    body('amount').isNumeric(),
  ],
  validateRequest,
  isAuthenticated,
  addRepayment
);

module.exports = router;
