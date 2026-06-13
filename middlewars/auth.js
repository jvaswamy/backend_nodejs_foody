const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const userModel = require("../models/userModel");

dotEnv.config();
const secretKey = process.env.whatIsYourName;

// Authentication middleware: validates JWT token passed in `token` header
const authMeddleware = async (req, res, next) => {
  const token = req.headers["token"];
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized: login required",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.body.userId = user._id;
    next();
  } catch (error) {
    console.error("auth error:", error.message || error);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authMeddleware;
