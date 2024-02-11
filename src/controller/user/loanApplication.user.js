const LoanApplication = require("../../models/Loan/loanapplication.model");
const createLoanApplication = async (req, res) => {
  const accountId = req.user.accountId; // Assuming accountId is stored in the user's session or token
  const userId = req.user.userId;

  const { amount, requestedTerm } = req.body;
  try {
    const existingUser = await LoanApplication.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({
        message: "only 1 requests per user allowed",
        status: "400",
      });
    }
    // Create a new loan application document
    const loanApplication = await LoanApplication.create({
      userId,
      amount,
      requestedTerm: requestedTerm,
    });
    return res.status(200).json({
      success: true,
    });
    return { success: true, loanApplication };
  } catch (error) {
    console.error("Error creating loan application:", error);
    return { success: false, message: "Failed to create loan application" };
  }
};

module.exports = createLoanApplication;
