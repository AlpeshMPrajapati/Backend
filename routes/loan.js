const express = require('express');
const router = express.Router();
const {createLoan,approveLoan,getLoansForUser,getAllLoan} = require('../controllers/loanController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validationMiddleware');

// Create a loan request route (requires authentication)
router.post(
  '/create',
  [
    body('amount').isNumeric(),
    body('term').isInt({ min: 1 }),
  ],
  validateRequest,
  isAuthenticated,
  createLoan
);

// Admin approves a loan request route (requires authentication and admin role)
router.post('/approve', isAuthenticated, isAdmin, getAllLoan)
router.post('/approve/:id', isAuthenticated, isAdmin, approveLoan);

// Get all loans for a user route (requires authentication)
router.post('/', isAuthenticated, getLoansForUser);

module.exports = router;
