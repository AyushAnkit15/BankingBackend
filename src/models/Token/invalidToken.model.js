const mongoose = require('mongoose');

// Define a Mongoose schema for invalidated tokens
const invalidatedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true }
});

// Create a Mongoose model for invalidated tokens
const InvalidatedToken = mongoose.model('InvalidatedToken', invalidatedTokenSchema);

module.exports = InvalidatedToken ; 
