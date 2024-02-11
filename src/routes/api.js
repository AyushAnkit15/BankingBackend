const express = require("express");
const app = express();

const authRoutes = require("./Auth/auth.router");

const adminRouter = require("../routes/admin/admin.router");
const userRouter = require("../routes/user/user.router");


const api = express.Router();
api.use("/auth", authRoutes);
api.use("/admin", adminRouter);
api.use("/user", userRouter);


module.exports = api;
