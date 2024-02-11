const express = require("express");
require("dotenv").config;
const morgan = require("morgan");
const api = require("./routes/api");
const verifyToken  =require('./utils/token/verifyToken')
const helmet = require('helmet')
const updatedLoanAmount = require('./cron/loan.cron')
const app = express();
const {getBalances} = require('./cron/financials.cron')

app.use(helmet()) ; 
app.use(morgan("combined"));

app.use(express.json());
updatedLoanAmount() ; 
getBalances() ; 
app.use("/v1", api);
app.use('/protected' , verifyToken , (req , res)=>{
  console.log('welcome to secret')  
  res.status(200).json('heyey');
})
app.use("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
