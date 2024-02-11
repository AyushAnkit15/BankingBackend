const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Savings", "Checking"],
    required: false,
    default: "Savings",
  },
  balance: {
    type: Number,
    default: 0,
  },
  hasLoan: {
    type: Boolean,
    default: false,
  },
  loanAmount: {
    type: Number,
    default: 0,
  },
  loanNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Account model
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
