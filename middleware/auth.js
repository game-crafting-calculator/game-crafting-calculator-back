const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    console.log(decodedToken);
    const user_id = decodedToken.user_id;
    req.user = {
      user_id: user_id,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
