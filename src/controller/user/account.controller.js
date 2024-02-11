const uuid =require('uuid') ; 
const Account  =require('../../models/Account/account.model')
const {User} = require('../../models/User/user.model')
const jwt = require('jsonwebtoken');

// Function to generate JWT token with account ID
const generateAuthToken = (userId, accountId  , role) => {
  // Define payload with user ID and account ID
  const payload = {
    userId,
    accountId , role
  };

  // Generate and return JWT token
  return jwt.sign(payload, 'society2022-2025', { expiresIn: '1h' });
};

// const createAccount = async (req , res)=>{
//     try {
//         // Extract account details from request body
//        // const { type } = req.body;
    
//         // Generate a unique account number (you can use a library like 'uuid' for this)
//         const accountNumber = uuid.v4();
    
//         // Create the new account
//         const newAccount = await Account.create({
          
//             accountNumber: accountNumber,
//             userId: req.user.userId // Associate the account with the authenticated user
//         });
    
//         // Return success response with the newly created account details
//         res.status(201).json({ message: 'Account created successfully', account: newAccount });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
//     }

const createAccount = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user ID is extracted from authenticated request
    const role = req.user.role ; 

    // Check if the user already has an account
    const existingAccount = await Account.findOne({ owner: userId });
    if (existingAccount) {
      return res.status(400).json({ message: 'User already has an account' });
    }


    const accountNumber = uuid.v4();

    const {hasLoan , loanAmount} =req.body ; 
    // Create the account and associate it with the user
    const newAccount = await Account.create({ owner: userId, accountNumber:accountNumber , hasLoan : hasLoan , loanAmount : loanAmount });

    // Generate JWT token with user ID and account ID

    // await User.update({ _id: userId }, { $push: { accounts: newAccount._id } });

    await User.findByIdAndUpdate(userId, { $push: { accounts: newAccount._id } });
    const token = generateAuthToken(userId, newAccount._id , role);

    // Return success response with token
    res.status(201).json({ message: 'Account created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const accessAccount = async (req  ,res)=>{
  try {
    const userId = req.user.userId; 
    const role = req.user.role ; 

 
    const account = await Account.findOne({ owner: userId });
    if (!account) {
      return res.status(400).json({ message: 'User does not have an account' });
    }


  

    
    // Create the account and associate it with the user
   
    // Generate JWT token with user ID and account ID

    // await User.update({ _id: userId }, { $push: { accounts: newAccount._id } });

    
    const token = generateAuthToken(userId, account._id , role);

    // Return success response with token
    res.status(201).json({ message: `account number ${account.accountNumber} opened`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports={createAccount   ,  accessAccount} ;