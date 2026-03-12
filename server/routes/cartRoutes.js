const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Cart is stored client-side (Redux); these endpoints handle server-side validation

// @desc    Validate cart items (stock check)
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const validatedItems = [];
    const warnings = [];

    for (const item of items) {
      const product = await Product.findById(item.product).select('name price discountPrice stock images unit isActive');
      if (!product || !product.isActive) {
        warnings.push(`"${item.name}" is no longer available`);
        continue;
      }
      if (product.stock === 0) {
        warnings.push(`"${product.name}" is out of stock`);
        continue;
      }
      const qty = Math.min(item.quantity, product.stock);
      if (qty < item.quantity) warnings.push(`Only ${qty} units of "${product.name}" available`);
      validatedItems.push({ ...item, quantity: qty, price: product.discountPrice || product.price, image: product.images[0]?.url, unit: product.unit });
    }

    res.status(200).json({ success: true, items: validatedItems, warnings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Apply coupon
router.post('/apply-coupon', protect, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });

    const validity = coupon.isValid(orderAmount, req.user._id);
    if (!validity.valid) return res.status(400).json({ success: false, message: validity.message });

    const discount = coupon.calculateDiscount(orderAmount);
    res.status(200).json({
      success: true,
      discount: Math.round(discount),
      couponCode: coupon.code,
      message: `Coupon applied! You save ₹${Math.round(discount)}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
