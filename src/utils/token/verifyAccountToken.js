const jwt= require('jsonwebtoken')
const verifyTokenAndExtractAccountId = (req, res, next) => {
    // Extract token from request headers, query parameters, or cookies
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify token and extract account ID
    jwt.verify(token, 'society2022-2025', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Extract account ID from decoded token and add to request object
      req.user = { accountId: decodedToken.accountId  ,
        userId:decodedToken.userId , 
         role : decodedToken.role};
      next();
    });
  };

  module.exports = verifyTokenAndExtractAccountId ; 