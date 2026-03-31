const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/create',         createOrder);
router.get('/my-orders',       getUserOrders);
router.get('/:id',             getOrderById);
router.put('/:id/cancel',      cancelOrder);
router.post('/:id/return',     requestReturn);

module.exports = router;