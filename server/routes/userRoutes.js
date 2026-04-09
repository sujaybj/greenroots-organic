const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, toggleWishlist, markNotificationRead } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../config/cloudinary');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', uploadAvatar.single('avatar'), updateProfile);
router.put('/change-password', changePassword);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);
router.post('/wishlist/:id', toggleWishlist);
router.patch('/notifications/:id/read', markNotificationRead);

module.exports = router;
