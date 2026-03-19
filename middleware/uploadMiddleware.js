const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for business photos
const businessStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brandconnect/businesses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brandconnect/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'thumb', gravity: 'face' }],
  },
});

// Images only filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Max 5 business photos
const uploadBusinessPhotos = multer({
  storage: businessStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('photos', 5);

// Single avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');

// Error handler wrapper
const handleUploadError = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'File too large. Max size is 5MB' });
      if (err.code === 'LIMIT_FILE_COUNT')
        return res.status(400).json({ message: 'Too many files. Max is 5 photos' });
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

module.exports = { uploadBusinessPhotos, uploadAvatar, handleUploadError };