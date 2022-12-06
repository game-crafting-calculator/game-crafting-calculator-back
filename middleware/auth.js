const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization;
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       console.log(decodedToken);
       const userId = decodedToken.id;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};