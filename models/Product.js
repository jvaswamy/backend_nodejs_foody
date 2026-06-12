const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: [{ type: String, enum: ["veg", "non-veg"] }],
  },
  image: {
    type: String,
  },
  imagePublicId: {
    type: String,
  },
  bestSeller: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
