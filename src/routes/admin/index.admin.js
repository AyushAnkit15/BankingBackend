const express = require("express");
;
const { authorizeRole } = require("../../models/User/user.model");
const verifyToken = require("../../utils/token/verifyToken");
const {createAccount} = require('../../controller/user/account.controller')
const index = (req, res, next) => {
    // Verify JWT token (verifyToken middleware)
    // For simplicity, I'm assuming the token verification logic is in a separate middleware function called 'verifyToken'
    verifyToken(req, res, (error) => {
      if (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Check user role (authorizeRole("user") middleware)
      authorizeRole("admin")(req, res, next);
    })

  }

module.exports = index;