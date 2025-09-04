const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes


// const protect = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization;

//     if (token && token.startsWith("Bearer")) {
//       // Extract token from "Bearer <token>"
//       token = token.split(" ")[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Find user by ID (exclude password)
//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } else {
//       res.status(401).json({ message: "Not authorized, no token" });
//     }
//   } catch (error) {
//     res.status(401).json({ message: "Token failed", error: error.message });
//   }
// };

// Middleware to protect routes (bypassed for local testing)

const protect = async (req, res, next) => {
  // Replace the ObjectId below with a real user _id from your MongoDB users collection
  req.user = { id: "68b4186e037ec61d7d6d47d2", name: "Test User", email: "test@example.com" };
  next();
};


module.exports = { protect };
