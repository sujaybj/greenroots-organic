const Order   = require('../models/Order');
const Product = require('../models/Product');

// ── Cancellation fee rules (% of order total deducted) ────────
const CANCEL_FEE = {
  placed:         0,    // Free cancel
  confirmed:      0,    // Free cancel
  packed:         5,    // 5% fee
  shipped:        10,   // 10% fee
  outForDelivery: 15,   // 15% fee — mid-delivery
};

// @desc    Create order
// @route   POST /api/orders/create
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });

      // ── Stock check ──────────────────────────────────────
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }
      if (product.stock === 0) {
        return res.status(400).json({ success: false, message: `"${product.name}" is out of stock.` });
      }

      const price = product.discountPrice || product.price;
      itemsPrice += price * item.quantity;
      orderItems.push({
        product:  product._id,
        name:     product.name,
        image:    product.images?.[0]?.url || '',
        price,
        quantity: item.quantity,
        unit:     product.unit,
      });

      // ── Deduct stock immediately ─────────────────────────
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Coupon
    let discountAmount = 0;
    if (couponCode) {
      const Coupon = require('../models/Coupon');
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && itemsPrice >= coupon.minOrderAmount) {
        discountAmount = coupon.discountType === 'percentage'
          ? Math.round(itemsPrice * coupon.discountValue / 100)
          : coupon.discountValue;
      }
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice      = 0;   // GST included in price — not shown separately
    const totalAmount   = itemsPrice + shippingPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress,
      paymentMethod, itemsPrice, shippingPrice, taxPrice,
      discountAmount, totalAmount, couponCode,
      orderStatus: 'placed',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully', timestamp: new Date() }],
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order — with restock + cancellation fee for mid-delivery
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // Already cancelled or delivered
    if (['cancelled', 'delivered', 'returned'].includes(order.orderStatus))
      return res.status(400).json({ success: false, message: `Order is already ${order.orderStatus}` });

    const reason       = req.body.reason || 'Cancelled by user';
    const feePercent   = CANCEL_FEE[order.orderStatus] || 0;
    const cancelFee    = feePercent > 0 ? Math.round(order.totalAmount * feePercent / 100) : 0;
    const refundAmount = order.totalAmount - cancelFee;

    order.orderStatus  = 'cancelled';
    order.cancelledAt  = new Date();
    order.cancelReason = reason;
    order.cancelFee    = cancelFee;
    order.refundAmount = refundAmount;
    order.statusHistory.push({
      status: 'cancelled',
      note: cancelFee > 0
        ? `${reason}. Cancellation fee: ₹${cancelFee} (${feePercent}%). Refund: ₹${refundAmount}`
        : reason,
      timestamp: new Date(),
    });

    // ── AUTO RESTOCK ─────────────────────────────────────
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      cancelFee,
      refundAmount,
      feePercent,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin - Update order status
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, note, deliveryAgent } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    if (trackingId)    order.trackingId    = trackingId;
    if (deliveryAgent) order.deliveryAgent = deliveryAgent;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note: note || `Order ${status}`, timestamp: new Date() });

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin - Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { page=1, limit=20, status, paymentStatus } = req.query;
    const query = {};
    if (status)        query.orderStatus   = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const skip = (Number(page)-1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user','name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    res.status(200).json({ success: true, orders, total, pages: Math.ceil(total/Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request return / exchange / refund
exports.requestReturn = async (req, res) => {
  try {
    const { type, reason, description } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (order.orderStatus !== 'delivered')
      return res.status(400).json({ success: false, message: 'Return can only be requested for delivered orders' });
    if (!type)   return res.status(400).json({ success: false, message: 'Request type is required' });
    if (!reason) return res.status(400).json({ success: false, message: 'Reason is required' });
    order.returnRequest = { type, reason, description, status: 'pending', requestedAt: new Date() };
    order.statusHistory.push({ status: 'returned', note: type + ' requested: ' + reason, timestamp: new Date() });
    await order.save();
    res.status(200).json({ success: true, message: type + ' request submitted', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
