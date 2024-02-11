// require('dotenv').config({ path: '../../.env' });

const {User} = require('../../models/User/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError =require('../../utils/appError')
const InvalidatedToken  = require('../../models/Token/invalidToken.model')




const createUser = async (req, res) => {
    try {
        const { fullName, email, password , dateOfBirth , role  } = req.body;
        console.log(req.body)
       
        const existingUser = await User.findOne({ email });
        if (existingUser) { 
            return res.status(400).json({
                message: 'Email is already registered',
                status: '400',
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);


        DOB = new Date(dateOfBirth);
        // if (isNaN(dateOfBirth)) {
        //   return res.status(400).json({
        //     error: "Invalid Launch Date",
        //   });
        // }


      
        const newUser = new User({
            username : fullName, 
            email,
            password: hashedPassword,
            fullName , 
            role  :role , 
            dateOfBirth:DOB

        });

     
        const user = await newUser.save();
        console.log(user);

        res.status(201).json({
            message: 'User created successfully',
            status: 'success',
        });
    } catch (error) {
        console.error(error);
        res.json(AppError(error, 500));
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

       

       
        const user = await User.findOne({ email });

      
        if (!user) {
            return res.status(404).json({
                message: 'Invalid Email or Password',
                status: '404',
            });
        }

  
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid Email or Password',
                status: '401',
            });
        }

        const token = jwt.sign(   { userId: user._id, role: user.role } ,'society2022-2025', { expiresIn: '1h' });
const role = user.role ;
        res.status(200).json({ token  , role});
    } catch (error) {
        console.error(error);
        res.json(AppError(error, 500));
    }
};
const logoutUser =  async (req, res) => {
    try {
     
      const token = req.body.token || req.headers.authorization;
  
      
      await InvalidatedToken.create({ token });
  
     
      res.json({ message: 'Token invalidated' });
    } catch (error) {
     
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = {
    loginUser,
    createUser,
    logoutUser , 
 
};
