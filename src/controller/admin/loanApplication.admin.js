// Import the LoanApplication model
const LoanApplication = require("../../models/Loan/loanapplication.model");
const mongoose = require("mongoose");
const Loan = require("../../models/Loan/loan.model");
const Account = require("../../models/Account/account.model");

const getAllLoanApplications = async (req, res) => {
  try {
    const loanApplications = await LoanApplication.find();
    res.status(200).json(loanApplications);
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLoanApplicationById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid loan application ID" });
  }

  try {
    const loanApplication = await LoanApplication.findById(id);
    if (!loanApplication) {
      return res.status(404).json({ message: "Loan application not found" });
    }
    res.status(200).json(loanApplication);
  } catch (error) {
    console.error("Error fetching loan application by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLoanApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const loanApplication = await LoanApplication.findById(id);
    if (!loanApplication) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    loanApplication.status = status;
    await loanApplication.save();

    if (status === "Approved") {
      const account = await Account.findOne({ owner: loanApplication.userId });

      if (!account) {
        throw new Error("Account not found");
      }

      const loan = new Loan({
        userId: loanApplication.userId,
        amount: loanApplication.amount,
        interestRate: 0.02, // Assuming default interest rate
        term: loanApplication.requestedTerm,
        status: "Approved",
      });
      await loan.save();
      const loanNumber = await Loan.findOne({ userId: loanApplication.userId });

      account.hasLoan = true;
      account.loanAmount = loanApplication.amount;
      account.loanNumber = loanNumber;
      await account.save();
    }
    res
      .status(200)
      .json({ message: "Loan application status updated successfully" });
  } catch (error) {
    console.error("Error updating loan application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllLoanApplications,
  getLoanApplicationById,
  updateLoanApplicationStatus,
};
