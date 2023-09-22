const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan', // Reference to the Loan model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID'], // Status can be PENDING or PAID
    default: 'PENDING',
  },
  repaymentDate: {
    type: Date,
    default: Date.now, // Default to the current date
  },
});

module.exports = mongoose.model('Repayment', repaymentSchema);
