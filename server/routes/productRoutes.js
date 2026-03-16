const express = require('express');
const router  = express.Router();
const {
  getProducts, getProduct, addReview, getCategories,
  checkDelivery, updateDeliveryAreas,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../config/cloudinary');

// Public
router.get('/',            getProducts);
router.get('/categories',  getCategories);
router.get('/:id',         getProduct);
router.get('/:id/delivery-check', checkDelivery);  // ← NEW: check if deliverable to pincode/state

// Protected
router.post('/:id/review', protect, addReview);

// Admin
router.put('/:id/delivery-areas', protect, adminOnly, updateDeliveryAreas);  // ← NEW

// These use createProduct/updateProduct from adminController (full product CRUD)
const { createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
router.post('/',    protect, adminOnly, uploadProductImages.array('images', 5), createProduct);
router.put('/:id',  protect, adminOnly, uploadProductImages.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
