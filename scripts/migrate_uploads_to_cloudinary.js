require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const Food = require('../models/foodModel');
const Product = require('../models/Product');

async function uploadFile(localPath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(localPath, { folder: 'foody' }, (err, res) => {
      if (err) {
        // include full error for diagnosis
        console.error('Cloudinary upload error object:', err);
        return reject(err);
      }
      resolve(res);
    });
  });
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to DB');

  const processModel = async (Model, modelName) => {
    const items = await Model.find({});
    for (const item of items) {
      if (!item.image) continue;
      if (item.image.startsWith('http')) continue; // already migrated
      const localPath = path.join(__dirname, '..', 'uploads', item.image);
      if (!fs.existsSync(localPath)) {
        console.warn(modelName, item._id, 'local file missing:', localPath);
        continue;
      }
      try {
        const res = await uploadFile(localPath);
        item.image = res.secure_url;
        item.imagePublicId = res.public_id;
        await item.save();
        console.log('Migrated', modelName, item._id);
        // optional: fs.unlinkSync(localPath);
      } catch (e) {
        console.error('Failed to upload', localPath);
        console.error('Error name:', e.name);
        console.error('HTTP code:', e.http_code || e.status || 'n/a');
        console.error('Full error:', e);
      }
    }
  };

  await processModel(Food, 'Food');
  await processModel(Product, 'Product');

  console.log('Migration finished');
  mongoose.disconnect();
}

migrate().catch((e) => { console.error(e); process.exit(1); });
