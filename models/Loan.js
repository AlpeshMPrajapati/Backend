const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (assuming you have a User model)
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  term: {
    type: Number,
    required: true,
  },
  scheduledRepayments: [
    {
      dueDate: {
        type: Date,
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
    },
  ],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'PAID'], // Status can be PENDING, APPROVED, or PAID
    default: 'PENDING',
  },
});

module.exports = mongoose.model('Loan', loanSchema);
