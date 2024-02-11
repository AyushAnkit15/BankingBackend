const mongoose = require('mongoose');

// Define the loan repayment schema
const loanRepaymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  repaymentDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the LoanRepayment model
const LoanRepayment = mongoose.model('LoanRepayment', loanRepaymentSchema);

module.exports = LoanRepayment;
