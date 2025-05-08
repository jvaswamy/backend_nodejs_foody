const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/Firm");
const path = require("path");

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Filter to allow only images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found!" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct);

    await firm.save();

    res.status(200).json({ savedProduct });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No Firm Found" });
    }
    const resturentName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ resturentName, products });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ error: "No Product found" });
    }
    res.json("product is deleted successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct: [upload.single("image")],
  getProductByFirm,
  deleteProductById,
};
