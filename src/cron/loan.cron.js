const Loan = require("../models/Loan/loan.model");
const Account = require("../models/Account/account.model");
const cron = require("node-cron");

const updatedLoanAmount = () => {
  cron.schedule(" 0 0 1 * *", async () => {
    console.log("running cron");
    try {
      const loans = await Loan.find({ status: "Approved" });

      for (const loan of loans) {
        const account = await Account.findOne({ owner: loan.userId });

        const newAmount = loan.amount + loan.interestRate * loan.amount;

        const newTerm = loan.timeLeft - 1;
        const inter = newAmount - loan.amount;

        loan.timeLeft = newTerm;
        loan.amount = newAmount;
        loan.interest += inter;

        account.loanAmount += newAmount;

        await loan.save();
        await account.save();
      }

      console.log("Loan amounts updated successfully");
    } catch (error) {
      console.error("Error updating loan amounts:", error);
    }
  });
};

module.exports = updatedLoanAmount;
