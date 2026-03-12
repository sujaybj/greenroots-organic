const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, getCategories } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/:id/review', protect, addReview);
router.post('/', protect, adminOnly, uploadProductImages.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, uploadProductImages.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
