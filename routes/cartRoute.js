const express = require("express");
const authMeddleware = require("../middlewars/auth");
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.post("/add", authMeddleware, addToCart);
cartRouter.post("/remove", authMeddleware, removeFromCart);
cartRouter.post("/items", authMeddleware, getCartItems);

module.exports = cartRouter;
