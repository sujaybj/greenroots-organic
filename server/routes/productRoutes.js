const express = require('express');
const router  = express.Router();
const {
  getProducts, getProduct, addReview, getCategories, getReviewEligibility,
  checkDelivery, updateDeliveryAreas,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../config/cloudinary');

// Public
router.get('/',                   getProducts);
router.get('/categories',         getCategories);
router.get('/:id',                getProduct);
router.get('/:id/delivery-check', checkDelivery);

// Protected
router.get('/:id/review-eligibility', protect, getReviewEligibility);
router.post('/:id/review', protect, addReview);

// Admin
router.put('/:id/delivery-areas',                                              protect, adminOnly, updateDeliveryAreas);
router.post('/',   protect, adminOnly, uploadProductImages.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, uploadProductImages.array('images', 5), updateProduct);
router.delete('/:id',                                                          protect, adminOnly, deleteProduct);

module.exports = router;
