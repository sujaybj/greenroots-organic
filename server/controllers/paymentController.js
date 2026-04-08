// server/controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const Order    = require('../models/Order');
const { cleanEnvValue } = require('../utils/env');

const getRazorpay = () => {
  const keyId = cleanEnvValue(process.env.RAZORPAY_KEY_ID);
  const keySecret = cleanEnvValue(process.env.RAZORPAY_KEY_SECRET);

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not configured correctly');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const razorpay = getRazorpay();
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // ── Create Razorpay order with timeout ─────────────────
    const razorpayOrder = await Promise.race([
      razorpay.orders.create({
        amount:   Math.round(order.totalAmount * 100), // paise
        currency: 'INR',
        receipt:  `gr_${orderId.toString().slice(-8)}`,
        notes:    { orderId: orderId.toString(), userId: req.user._id.toString() },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Razorpay timeout — please retry')), 15000)
      ),
    ]);

    order.paymentDetails = { razorpayOrderId: razorpayOrder.id };
    await order.save();

    res.status(200).json({
      success:         true,
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
      key:             cleanEnvValue(process.env.RAZORPAY_KEY_ID),
    });
  } catch (error) {
    console.error('Payment create error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Payment initialization failed. Please retry.' });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const expected = crypto
      .createHmac('sha256', cleanEnvValue(process.env.RAZORPAY_KEY_SECRET))
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature)
      return res.status(400).json({ success: false, message: 'Payment verification failed. Please contact support.' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'paid';
    order.orderStatus   = 'confirmed';
    order.paymentDetails = { razorpayOrderId, razorpayPaymentId, razorpaySignature, paidAt: new Date() };
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received successfully' });
    await order.save();

    res.status(200).json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Razorpay webhook
// @route   POST /api/payment/webhook
exports.razorpayWebhook = async (req, res) => {
  try {
    const sig      = req.headers['x-razorpay-signature'];
    const expected = crypto
      .createHmac('sha256', cleanEnvValue(process.env.RAZORPAY_WEBHOOK_SECRET || ''))
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (sig !== expected) return res.status(400).json({ success: false, message: 'Invalid signature' });

    const { event, payload } = req.body;
    if (event === 'payment.failed') {
      await Order.findOneAndUpdate(
        { 'paymentDetails.razorpayOrderId': payload.payment.entity.order_id },
        { paymentStatus: 'failed', $push: { statusHistory: { status: 'placed', note: 'Payment failed' } } }
      );
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
