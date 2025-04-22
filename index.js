const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRouters = require("./routes/productRoutes");
// const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());
// app.use(cors());

dotEnv.config();

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

app.use("/", (req, res) => {
  res.send("<h1>Welcome to the Foody App</h1>");
});

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRouters);
app.use("/uploads", express.static("uploads")); //standard farmat
