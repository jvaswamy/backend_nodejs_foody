const foodModel = require("../models/foodModel");
const fs = require("fs");


//add food item
const addFood = async (req, res) => {
    // let image_filename=req.file ? req.file.filename : undefined;
    let image_filename=`${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    }); 

    try {
        await food.save()
        res.json({ success:true,message: "food item added successfully" });
    }
    catch (error) {
        console.error(error);
        res.json({ success:false,message: "internal server error" });
    };
}

//All food items
const listFood = async (req, res) => {
    try {
        const foods= await foodModel.find({});
        res.json({ success:true,data:foods });
        
    } catch (error) {
        console.error(error);
        res.json({ success:false,message: "internal server error" });
    }
}

//Remove food item
const removeFood = async (req, res) => {
  try {
    const food= await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {}); 

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success:true,message: "food item removed successfully" });

  } catch (error) {
    res.json({ success:false,message: "internal server error" });
  }
}

module.exports = {addFood,listFood,removeFood}; 