const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');

// Create a new loan request
exports.createLoan = async (req, res) => {
  try {
    const { amount, term } = req.body;
    const userId = req.user.id; // Assuming you have authentication in place

    // Calculate scheduled repayments
    const repaymentAmount = amount / term;
    const scheduledRepayments = [];

    const currentDate = new Date(); // Get the current date
    currentDate.setDate(currentDate.getDate() + 7);
    for (let i = 0; i < term; i++) {
      const dueDate = new Date(currentDate); // Clone the current date
      dueDate.setDate(currentDate.getDate() + i * 7); // Add i weeks to the current date
      // console.log(dueDate.getDate());
      scheduledRepayments.push({
        dueDate,
        amount: repaymentAmount,
        status: 'PENDING',
      });
    }

    // Create a new loan and associated repayments
    const loan = new Loan({
      userId,
      amount,
      term,
      scheduledRepayments,
      status: 'PENDING',
    });

    await loan.save();

    res.status(201).json({ message: 'Loan request created successfully', loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Approve a loan request (Admin action)
exports.approveLoan = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status: 'APPROVED' },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ 
        success:false,
        error: 'Loan not found' 
      });
    }

    res.json({ 
      success:true,
      message: 'Loan approved', 
      loan 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      error: error.message 
    });
  }
};


exports.getAllLoan = async(req,res)=>{
  try {
    const allLoan = await Loan.find();

    res.json({
      success:true,
      Loans : allLoan
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

// Get all loans for a user (Customer action)
exports.getLoansForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.find({ userId });

    res.json({
      success:true,
      loan:loans 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success:false,
      error: error.message 
    });
  }
};
