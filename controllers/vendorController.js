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
    const vendor = await Vendor.findOne({ email }).populate("firm");
    if (!vendor || (await bcrypt.compare(password, vendor.password))) {
      return res
        .status(500)
        .json({ error_msg: "Invalid Username or Password" });
    }
    // const payload={vendorId:vendor._id}
    const token = jwtToken.sign({ vendorId: vendor._id }, secretKey);
    // {expiresIn: "1h",}
    const vendorId = vendor._id;
    const firmName = vendor.firm.length !== 0 ? vendor.firm[0].firmName : "";

    res
      .status(200)
      .json({ success: "Login successfully", token, vendorId, firmName });
    console.log("Login successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId).populate("firm");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorResister, vendorLogin, getAllVendors, getVendorById };
