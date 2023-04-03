const jwt = require("jsonwebtoken");
const secret = process.env.MY_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(400);
    }
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
