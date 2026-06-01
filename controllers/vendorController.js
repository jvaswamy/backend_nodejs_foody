const Vendor = require("../models/Vendor");
const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

dotEnv.config();
const secretKey = process.env.whatIsYourName;

const vendorResister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ error: "Email already Taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    newVendor.save();

    res.status(201).json({ message: "Vendor registered successfully" });
    console.log("registered");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res
        .status(500)
        .json({ error_msg: "Invalid Username or Password" });
    }
    // const payload={vendorId:vendor._id}
    const token = jwtToken.sign({ vendorId: vendor._id }, secretKey);
    // {expiresIn: "1h",}
    const vendorId = vendor._id;

    res.status(200).json({ success: "Login successfully", token, vendorId });
    console.log("Login successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorResister, vendorLogin };
