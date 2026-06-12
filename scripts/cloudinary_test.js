require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const filePath = process.argv[2] || path.join(__dirname, '..', 'uploads', 'test.jpg');

console.log('Testing Cloudinary upload. File:', filePath);

if (!fs.existsSync(filePath)) {
  console.error('File does not exist:', filePath);
  console.error('Provide a valid file path as `node scripts/cloudinary_test.js path/to/file.jpg`');
  process.exit(1);
}

// Diagnostic: check env vars loaded (mask secret)
console.log('CLOUDINARY_CLOUD_NAME=', !!process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME : '(missing)');
console.log('CLOUDINARY_API_KEY=', !!process.env.CLOUDINARY_API_KEY ? '(present, length=' + process.env.CLOUDINARY_API_KEY.length + ')' : '(missing)');
console.log('CLOUDINARY_API_SECRET=', !!process.env.CLOUDINARY_API_SECRET ? '(present, length=' + process.env.CLOUDINARY_API_SECRET.length + ')' : '(missing)');


cloudinary.uploader.upload(filePath, { folder: 'foody' }, (err, res) => {
  if (err) {
    console.error('Upload failed');
    console.error('Error name:', err.name);
    console.error('HTTP code:', err.http_code || err.status || 'n/a');
    console.error('Full error:', err);
    process.exit(1);
  }
  console.log('Upload successful:', res.secure_url);
  process.exit(0);
});
