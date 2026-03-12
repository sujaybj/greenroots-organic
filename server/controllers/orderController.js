// ─── server/controllers/orderController.js ──────────────────
const Order   = require('../models/Order');
const Product = require('../models/Product');
const Coupon  = require('../models/Coupon');
const User    = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/tokenUtils');
const {
  sendOrderConfirmationWhatsApp,
  sendOrderStatusWhatsApp,
} = require('../utils/whatsappUtils');

// Helper — send notifications without crashing main flow
const notify = async (fn, ...args) => {
  try { await fn(...args); } catch (e) { console.error('Notification error:', e.message); }
};

// ── Create Order ─────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const price = product.discountPrice || product.price;
      itemsPrice += price * item.quantity;
      orderItems.push({
        product: product._id, name: product.name,
        image: product.images[0]?.url, price,
        quantity: item.quantity, unit: product.unit,
      });
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice      = Math.round(itemsPrice * 0.05);
    let   discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validity = coupon.isValid(itemsPrice, req.user._id);
        if (validity.valid) discountAmount = coupon.calculateDiscount(itemsPrice);
      }
    }

    const totalAmount = itemsPrice + shippingPrice + taxPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress,
      paymentMethod, itemsPrice, shippingPrice, taxPrice,
      discountAmount, totalAmount, couponCode,
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
    });

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Update coupon usage
    if (couponCode && discountAmount > 0) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } }
      );
    }

    // ── Notifications ────────────────────────────────────────
    // Email confirmation
    await notify(sendOrderConfirmationEmail, req.user.email, req.user.name, order);

    // WhatsApp confirmation (if user has phone)
    if (req.user.phone) {
      await notify(sendOrderConfirmationWhatsApp, req.user.phone, req.user.name, order);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Orders ─────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };
    if (status) query.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Order ──────────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Cancel Order ──────────────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const cancellable = ['placed', 'confirmed'];
    if (!cancellable.includes(order.orderStatus))
      return res.status(400).json({ success: false, message: `Cannot cancel order at ${order.orderStatus} stage` });

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ status: 'cancelled', note: order.cancelReason });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    await order.save();

    // Notify user on WhatsApp
    if (order.user.phone) {
      await notify(sendOrderStatusWhatsApp, order.user.phone, order.user.name, order, 'cancelled');
    }

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin: Get All Orders ─────────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    res.status(200).json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin: Update Order Status + WhatsApp notification ────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, note } = req.body;

    // Populate user so we have phone number
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    const prevStatus  = order.orderStatus;
    order.orderStatus = status;
    if (trackingId)         order.trackingId  = trackingId;
    if (trackingId)         order.trackingNumber = trackingId;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note: note || `Order ${status}` });

    await order.save();

    // ── Send WhatsApp status update to customer ─────────────
    if (order.user?.phone && status !== prevStatus) {
      await notify(sendOrderStatusWhatsApp, order.user.phone, order.user.name, order, status);
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
