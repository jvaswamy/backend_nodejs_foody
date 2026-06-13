const express = require("express");
const {
  addFood,
  listFood,
  removeFood,
} = require("../controllers/foodController");

const foodRouter = express.Router();

// use memory storage so we can upload directly to Cloudinary
// const upload = multer({ storage: multer.memoryStorage() });

foodRouter.post("/add", addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/remove", removeFood);

module.exports = foodRouter;
