const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const Client = require("../models/Client");

dotEnv.config();

const secretKey = process.env.whatIsYourName;

const normalizeMobileNumber = (mobileNumber = "") =>
  mobileNumber.toString().trim().replace(/\s+/g, "");

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobileNumber = (mobileNumber = "") => /^\d{10,15}$/.test(mobileNumber);

const registerClient = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);

    if (!name || !email || !mobileNumber) {
      return res
        .status(400)
        .json({ error: "Name, email and mobileNumber are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res
        .status(400)
        .json({ error: "Mobile number must contain 10 to 15 digits" });
    }

    const existingClient = await Client.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingClient) {
      if (existingClient.email === email) {
        return res.status(409).json({ error: "Email already registered" });
      }

      return res.status(409).json({ error: "Mobile number already registered" });
    }

    const newClient = await Client.create({
      name,
      email,
      mobileNumber,
    });

    res.status(201).json({
      message: "Client registered successfully",
      client: {
        _id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        mobileNumber: newClient.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Client registration failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginClient = async (req, res) => {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);

    if (!mobileNumber) {
      return res.status(400).json({ error: "mobileNumber is required" });
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res
        .status(400)
        .json({ error: "Mobile number must contain 10 to 15 digits" });
    }

    const client = await Client.findOne({ mobileNumber });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const token = jwt.sign({ clientId: client._id }, secretKey, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Client login successful",
      token,
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        mobileNumber: client.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Client login failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllClients = async (_req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({ clients });
  } catch (error) {
    console.error("Fetching clients failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerClient,
  loginClient,
  getAllClients,
};
