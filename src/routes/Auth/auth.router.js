const express = require('express') ;
const  {loginUser , createUser , logoutUser} = require('../../controller/auth/auth.controller')
const authRouter = express.Router() ;
const verifyToken= require('../../utils/token/verifyToken')

authRouter.post('/register',createUser);
authRouter.post('/login',loginUser);
authRouter.post('/logout' , verifyToken  ,logoutUser )


module.exports = authRouter ; 