const express = require('express');
const router = express.Router();
const { protect, vendorOnly } = require('../middleware/authMiddleware');
const { uploadBusinessPhotos, handleUploadError } = require('../middleware/uploadMiddleware');
const { createProfile, getProfile, updateProfile, deleteProfile } = require('../controllers/vendorController');

router.post('/create-profile', protect, vendorOnly, handleUploadError(uploadBusinessPhotos), createProfile);
router.get('/:id', getProfile);
router.put('/update-profile',  protect, vendorOnly, handleUploadError(uploadBusinessPhotos), updateProfile);
router.delete('/delete',       protect, vendorOnly, deleteProfile);

module.exports = router;