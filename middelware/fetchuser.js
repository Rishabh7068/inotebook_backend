const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_secret = process.env.JWT;

const fetchuser = (req, res , next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access Denied" + token });
  }
  try {
    const data = jwt.verify(token, JWT_secret);
    req.user = data.user;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Access Denied" });
  }
};

module.exports = fetchuser;
