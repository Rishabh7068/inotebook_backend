const jwt = require("jsonwebtoken");
const JWT_secret = "Rishabh&inotebook";

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
