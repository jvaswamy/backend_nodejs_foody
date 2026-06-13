const express = require("express");
const dotEnv = require("dotenv");
dotEnv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const vendorRoutes = require("./routes/vendorRoutes");

const dns = require("dns");
const cors = require("cors");
const path = require("path");
const foodRouter = require("./routes/foodRoute");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const { PORT } = require("./data/apiPath");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = PORT || 4000;

dns.setServers(["1.1.1.1", "8.8.8.8"]); //used for dns resolution to avoid "getaddrinfo ENOTFOUND" error when connecting to MongoDB Atlas

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });

// new implementation
app.use("/vendor", vendorRoutes);
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/images", express.static("uploads")); //standard farmat

app.listen(port, () => console.log(`Server is running at ${port}`));

app.use("/", (req, res) => {
  res.send("<h1>welcome to Foody</h1>");
});
