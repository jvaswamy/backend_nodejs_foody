const foodModel = require("../models/foodModel");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");


//add food item
const addFood = async (req, res) => {
    try {
        let imageUrl;
        let imagePublicId;
        if (req.file && req.file.buffer) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "foody" }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        } else if (req.body.image) {
            imageUrl = req.body.image;
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageUrl,
            imagePublicId,
        });

        await food.save();
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
        if (food) {
            // remove Cloudinary asset if stored
            if (food.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(food.imagePublicId);
                } catch (e) {
                    console.error('Failed to delete cloudinary asset', food.imagePublicId, e.message || e);
                }
            } else if (food.image && !food.image.startsWith("http")) {
                // if image is local filename, remove local file
                fs.unlink(`uploads/${food.image}`, () => {});
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success:true,message: "food item removed successfully" });

    } catch (error) {
        res.json({ success:false,message: "internal server error" });
    }
}

module.exports = {addFood,listFood,removeFood}; 