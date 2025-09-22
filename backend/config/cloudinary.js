const cloudinary = require('cloudinary').v2;

// Enable Cloudinary with correct cloud name
const CLOUDINARY_ENABLED = true;

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: 'dooljt6ah', // Your actual cloud name
    api_key: '291264651798221',
    api_secret: 'h-l2JB4qRxduYy2SibJamZmCK5M'
  });
}

module.exports = { cloudinary, CLOUDINARY_ENABLED };
