const express = require("express");
const adminRouter = express.Router();
const transactionController = require("../../controller/transaction/transaction.controller");
const { authorizeRole } = require("../../models/User/user.model");
const index = require("./index.admin");
const { createAccount } = require("../../controller/user/account.controller");
const verifyAndExtractAccountId = require("../../utils/token/verifyAccountToken");
const {
  getAllLoanApplications,
  getLoanApplicationById,
  updateLoanApplicationStatus,
} = require("../../controller/admin/loanApplication.admin");
const { accessLoan } = require("../../controller/admin/loan.admin");
const {
  viewAllUsers,
  deleteUser,
  checkDeposit,
} = require("../../controller/admin/usercontrol.admin");

adminRouter.get("/dashboard", index, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

adminRouter.post("/newaccount", index, createAccount);
adminRouter.post(
  "/transactions/deposit",
  verifyAndExtractAccountId,
  authorizeRole("admin"),
  transactionController
);
adminRouter.get(
  "/loanApplications",
  verifyAndExtractAccountId,
  authorizeRole("admin"),
  getAllLoanApplications
);

// Get a single loan application by ID
adminRouter.get(
  "/loanApplications/:id",
  verifyAndExtractAccountId,
  getLoanApplicationById
);

adminRouter.get("/loan/:id", index, accessLoan);

// Approve or reject a loan application
adminRouter.patch("/loanApplications/:id", index, updateLoanApplicationStatus);

adminRouter.get("/users", index, viewAllUsers);
adminRouter.get("/users/:userId", index, deleteUser);
adminRouter.get("/users/:userId/deposits/:year/:month", index, checkDeposit);

module.exports = adminRouter;
