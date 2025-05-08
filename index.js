const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRouters = require("./routes/productRoutes");

const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 4000;

dotEnv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRouters);
app.use("/uploads", express.static("uploads")); //standard farmat

app.listen(port, () => console.log(`Server is running at ${port}`));

// app.use("/", (req, res) => {
//   res.send("<h1>Welcome to the Foody App</h1>");
// });
