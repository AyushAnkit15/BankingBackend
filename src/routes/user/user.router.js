const express = require("express");
const userRouter = express.Router();
const {authorizeRole} = require('../../models/User/user.model')
const index = require("./index.user");
const { createAccount } = require("../../controller/user/account.controller");
const transactionController = require('../../controller/transaction/transaction.controller')
const verifyAndExtractAccountId = require('../../utils/token/verifyAccountToken')
const createLoanApplication = require('../../controller/user/loanApplication.user')
const {accessAccount} =require('../../controller/user/account.controller') ; 
const {getLoanApplicationById}  = require('../../controller/admin/loanApplication.admin')

userRouter.get("/profile", index, (req, res) => {
  res.json({ message: "Viewing user profile" });
});

userRouter.post("/newaccount", index, createAccount);
userRouter.post('/transactions/deposit' , verifyAndExtractAccountId ,authorizeRole('user') , transactionController)
userRouter.post('/newloan' , verifyAndExtractAccountId , authorizeRole('user') ,   createLoanApplication) ; 
userRouter.get('/loanApplications/:id', verifyAndExtractAccountId, getLoanApplicationById);
userRouter.get('/account' , index , accessAccount) ; 

module.exports = userRouter;
