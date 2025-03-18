// const jwt = require("jsonwebtoken");
// const User = require("../models/user.modal");
// require("dotenv").config();

// const verifyUser = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Access Denied" });
//   }

//   try {
//     const verified = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
//     req.user = verified;
//     next();
//   } catch (error) {
//     console.log("Token verification error:", error.message);
    
//     return res.status(400).json({ success: false, message: "Invalid Token" });
//   }
// };

// module.exports = verifyUser;

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    req.user = { _id: verified._id };  // Ensure _id is stored
    console.log("Verified User:", req.user);
    
    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = verifyUser;


