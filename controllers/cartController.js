const userModel = require("../models/userModel");

//add Items to user cart
const addToCart = async (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;

  try {
    let userData = await userModel.findById(userId);

    let cartData = await userData.cartData;
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] = cartData[itemId] + 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    res.json({ success: false, message: "Internal Server Error" });
  }
};

//remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    let cartData = await userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({
        success: true,
        message: "Item removed from cart successfully",
      });
    }
  } catch (error) {
    res.json({ success: false, message: "Internal Server Error" });
  }
};

//fetch user cart items
const getCartItems = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addToCart, removeFromCart, getCartItems };
