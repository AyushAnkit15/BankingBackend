const Transaction = require("../../models/Transaction/transaction.model");
const verifyTokenAndExtractTokenId = require("../../utils/token/verifyAccountToken");
const moment = require("moment");
const Account = require("../../models/Account/account.model");
const { User } = require("../../models/User/user.model");
const Loan = require("../../models/Loan/loan.model");

const transactionController = async (req, res) => {
  try {
    // Extract transaction details from request body
    const { type, transactionAmount, description, transactionDate } = req.body;

    // Extract account ID from the authenticated user's session or token
    const accountId = req.user.accountId; // Assuming accountId is stored in the user's session or token
    const userId = req.user.userId;

    // Retrieve the account
    const account = await Account.findById(accountId);

    // Check if account has loan and transaction is of type Loan
    if (type === "Loan" && account.hasLoan) {
      // Ensure sufficient loan transactionAmount
      if (account.loanAmount < transactionAmount) {
        loanNumber = account.loanNumber;
        const leftover = transactionAmount - account.loanAmount;
        account.loanAmount = 0;
        account.hasLoan = false;
        account.loanNumber = null;
        account.balance += leftover;
        await Loan.findOneAndUpdate(
          { _id: loanNumber },
          { amount: 0 }, // Decrement the amount by transactionAmount
          { new: true } // Return the updated document
        );
      } else if (account.loanAmount >= transactionAmount) {
        // Deduct transactionAmount from loanAmount
        loanNumber = account.loanNumber;
        await Loan.findOneAndUpdate(
          { _id: loanNumber },
          { $inc: { amount: -transactionAmount } }, // Decrement the amount by transactionAmount
          { new: true } // Return the updated document
        );
        account.loanAmount -= transactionAmount;
      } // else {
      //       return res.status(400).json({ message: 'Requested loan transactionAmount exceeds available loan transactionAmount' });
      //   }
    } else if (type === "Loan" && !account.hasLoan) {
      return res
        .status(400)
        .json({ message: "Cannot request loan as hasLoan is not active" });
    } else if (type === "Deposit") {
      // Add transactionAmount to balance
      account.balance += transactionAmount;

      // Update user's deposit array
      //   const user = await User.findById(userId);
      //   const currentDate = new Date();
      //   const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
      //   const currentYear = currentDate.getFullYear();

      //   // Check if deposit for current month and year already exists
      //   const depositExists = user.deposits.some(deposit => deposit.month === currentMonth && deposit.year === currentYear);
      //   if (!depositExists) {
      //       // Add deposit to user's deposit array
      //       user.deposits.push({ month: currentMonth, year: currentYear, date: currentDate });
      //       await user.save();
      //}

      const newD = new Date(transactionDate);
      const momentDate = moment(newD);
      const formattedDate = momentDate.format("YYYY-MM-DD");

      const month = momentDate.format("MM"); // Month in two digits (01-12)
      const date = momentDate.format("DD"); // Date of the month (01-31)
      const year = momentDate.format("YYYY"); // Full year (e.g., 2024)

      // Update the user's deposits array with the transaction date
      const user = await User.findById(userId);
      user.deposits.push({ month, date, year });
      await user.save();
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Save the updated account
    await account.save();

    // Create a new transaction
    const newTransaction = await Transaction.create({
      accountId,
      type,
      amount: transactionAmount,
      description,
    });

    // Return success response with information about the transaction
    res
      .status(201)
      .json({ message: "Transaction successful", transaction: newTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = transactionController;
