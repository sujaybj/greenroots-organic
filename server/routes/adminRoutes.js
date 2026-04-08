const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, createCoupon, getCoupons, toggleCoupon } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus, reviewReturnRequest } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/return-request', reviewReturnRequest);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.patch('/coupons/:id/toggle', toggleCoupon);

module.exports = router;
