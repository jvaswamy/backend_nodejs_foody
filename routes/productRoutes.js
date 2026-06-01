const productController = require("../controllers/productController");
const express = require("express");

const router = express.Router();

router.delete("/:productId", productController.deleteProductById);

// standart format
router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent({ "Content-type": "image/jpeg" });
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

module.exports = router;
