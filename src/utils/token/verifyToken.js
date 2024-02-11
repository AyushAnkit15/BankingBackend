// Import required modules
const jwt = require('jsonwebtoken');
const InvalidatedToken = require('../../models/Token/invalidToken.model')


const verifyToken =async  (req, res, next) => {
 
  const token = req.headers.authorization;

 
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }


  
    
  try {

    const invalidatedToken = await InvalidatedToken.findOne({ token });

    if (invalidatedToken) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
   
    const decodedToken = jwt.verify(token.split(' ')[1], 'society2022-2025');

 
    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role  
    };

  
    next();
  } catch (error) {

    return res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports=verifyToken ; 
