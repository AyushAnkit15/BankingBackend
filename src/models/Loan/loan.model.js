const mongoose = require("mongoose");

// Define the loan schema
const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
    default: 0.02,
  },
  interest: {
    type: Number,
    default: 0,
  },

  term: {
    type: Number,
    required: true, // Term in months, for example
  },

  timeLeft: {
    type: Number,
  },
  currentDate: {
    type: Date,
    default: Date.now, // Use the current date as the default value
    get: function () {
      // Get the date in YYYY-MM-DD format
      return this.currentDate.toISOString().split("T")[0];
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Closed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Loan model
const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
