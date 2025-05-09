const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// // Multer Storage Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../uploads"); // Save files to 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // Filter to allow only images
// const imageFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mime = allowedTypes.test(file.mimetype);
//   if (ext && mime) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
//   }
// };

// // Initialize multer
// const upload = multer({
//   storage: storage,
//   fileFilter: imageFilter,
//   // limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const saveFirm = await firm.save();
    vendor.firm.push(saveFirm);
    await vendor.save();

    return res.status(200).json({ message: "firm added succefully." });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deleteFirm = await Product.findByIdAndDelete(firmId);
    if (!deleteFirm) {
      return res.status(404).json({ error: "No Firm found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  deleteFirmById,
};
