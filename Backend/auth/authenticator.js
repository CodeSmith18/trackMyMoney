const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
//   console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error); // Add t
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};


module.exports = authenticateUser;