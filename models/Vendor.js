const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Vendor = mongoose.models.vender || mongoose.model("vender", vendorSchema);

module.exports = Vendor;
