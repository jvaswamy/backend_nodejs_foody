const express = require("express");
const {addFood,listFood,removeFood} = require("../controllers/foodController");
const multer = require("multer");

const foodRouter = express.Router();

// use memory storage so we can upload directly to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.delete("/remove",removeFood);

module.exports = foodRouter;  