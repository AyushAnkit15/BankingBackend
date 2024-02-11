const express = require("express");
const userRouter = express.Router();
const { authorizeRole } = require("../../models/User/user.model");
const verifyToken = require("../../utils/token/verifyToken");
const {createAccount} = require('../../controller/user/account.controller')
const index = require('./index.user')
userRouter.post("/new", index,createAccount );

module.exports = userRouter;