const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');

// Add a repayment for a loan
exports.addRepayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const loanId = req.params.loanId;

    // Check if the loan exists
    const loan = await Loan.findById(loanId);
    
        if (!loan) {
          return res.status(404).json({ 
            success:false,
            error: 'Loan not found' 
          });
        }
        
    const allPaid = loan.scheduledRepayments.every((repayment) => repayment.status === 'PAID');

    if (allPaid) {
      // Update the loan's status to "PAID"
      await Loan.findByIdAndUpdate(loanId, { status: 'PAID' });
      return res.json({
        success:true,
        message:"All Repayment is Paid"
      })
    }

    // Find the next pending repayment
    const nextRepayment = loan.scheduledRepayments.find(
      (repayment) => repayment.status === 'PENDING'
    );

    if (!nextRepayment) {
      return res.status(400).json({
        success:false,
        error: 'No pending repayments for this loan' 
      });
    }

    // Check if the repayment amount is greater than or equal to the scheduled amount
    if (amount < nextRepayment.amount) {
      return res.status(400).json({ error: 'Repayment amount is too low' });
    }

    // Mark the repayment as PAID
    nextRepayment.status = 'PAID';

    // Create a new repayment entry
    const repayment = new Repayment({
      loanId,
      amount,
      status: 'PAID',
    });

    await repayment.save();
    await loan.save();

    res.json({
      success:true,
      message: 'Repayment added successfully', 
      repayment 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      error: error.message 
    });
  }
};
