const { User } = require("../../models/User/user.model");

const viewAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, "-password"); // Exclude password field from the response

    // Send the list of users in the response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Send success response
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkDeposit = async (req, res) => {
  try {
    const { userId, year, month } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has submitted the deposit for the specified month
    const depositFound = user.deposits.some(
      (deposit) =>
        deposit.year === Number(year) && deposit.month === Number(month)
    );

    if (depositFound) {
      return res
        .status(200)
        .json({ message: "Deposit found for the specified month" });
    } else {
      return res
        .status(404)
        .json({ message: "Deposit not found for the specified month" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { viewAllUsers, deleteUser, checkDeposit };
