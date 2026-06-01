const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const userModel = require("../models/userModel");

dotEnv.config();
const secretKey = process.env.whatIsYourName;

// const authMeddleware = async (req, res, next) => {
//   const token = req.headers;
//   if (!token.token) {
//     return res.json({
//       success: false,
//       message: "Not Authorized login required",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     console.log(decoded);
//     req.body.userId = decoded.Id;
//     next();
//   } catch (error) {
//     res.json({ success: false, message: "Invalid Token" });
//   }
// };

const authMeddleware = async (req, res, next) => {
  const authHead = req.headers["token"];
  const token = authHead;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized login required",
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
    console.error(error);
    return res.status(500).json({ error: "Invalid Token" });
  }
};

module.exports = authMeddleware;
