// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'others';
    
    if (req.originalUrl.includes('/blogs')) {
      folder = 'blogs';
    } else if (req.originalUrl.includes('/gallery')) {
      folder = 'gallery';
    } else if (req.originalUrl.includes('/specials-promotion')) {
      folder = 'specials';
    } else if (req.originalUrl.includes('/services')) {
      folder = 'services';
    }

    const uploadPath = path.join('uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed!'), false);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
  fieldSize: 5 * 1024 * 1024, // 5 MB for text fields
};

module.exports = multer({ storage, fileFilter, limits });

