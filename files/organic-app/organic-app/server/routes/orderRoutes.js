const express = require('express');
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  cancelOrder, requestReturn,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/create',        createOrder);
router.get('/my-orders',      getMyOrders);
router.get('/:id',            getOrder);
router.put('/:id/cancel',     cancelOrder);
router.post('/:id/return',    requestReturn);   // ← NEW: return/refund/exchange

module.exports = router;
