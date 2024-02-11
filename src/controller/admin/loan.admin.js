const Loan = require("../../models/Loan/loan.model");
const Account = require("../../models/Account/account.model");
const mongoose = require("mongoose");

const accessLoan = async (req, res) => {
  // const accountId = req.user.accountId;
  // const account = await Account.findOne({_id:accountId}) ;
  // const loanNumber = account.loanNumber ;

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid loan ID" });
  }

  try {
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json(loan);
  } catch (error) {
    console.error("Error fetching loan  by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { accessLoan };
