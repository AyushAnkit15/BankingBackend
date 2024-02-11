const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: { 
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  deposits: [
    {
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      date: {
        type: Number,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model("User", userSchema);

const authorizeRole = (role) => {
  return (req, res, next) => {
    //if (!req.user || (req.user.role !== role && req.user.role !== 'admin')
    if (!req.user || (req.user.role !== role && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
module.exports = { User, authorizeRole };
