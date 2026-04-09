const Order = require('../models/Order');
const Product = require('../models/Product');

const CANCEL_FEE = {
  placed: 0,
  confirmed: 0,
  packed: 5,
  shipped: 10,
  outForDelivery: 15,
};

const STATE_MULTIPLIER = {
  Karnataka: 1,
  Maharashtra: 1.05,
  Delhi: 1.05,
  'Tamil Nadu': 1.03,
  Telangana: 1.03,
  Kerala: 1.04,
  'Uttar Pradesh': 1.08,
  Rajasthan: 1.08,
  default: 1.1,
};

const BLOCK_COD_CANCEL_STATUSES = new Set(['packed', 'shipped', 'outForDelivery']);
const RETURN_TYPES = new Set(['return', 'refund', 'replacement']);
const REPLACEMENT_REASONS = new Set([
  'Received damaged product',
  'Received defective product',
  'Received wrong product',
]);

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

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
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price,
        quantity: item.quantity,
        unit: product.unit,
      });

      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

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
    const taxPrice = 0;
    const totalAmount = itemsPrice + shippingPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalAmount,
      couponCode,
      orderStatus: 'placed',
      paymentStatus: 'pending',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully', timestamp: new Date() }],
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['cancelled', 'delivered', 'returned'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Order is already ${order.orderStatus}` });
    }

    if (order.paymentMethod === 'cod' && BLOCK_COD_CANCEL_STATUSES.has(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'COD orders cannot be cancelled after packing. Please request a return after delivery.',
      });
    }

    const reason = req.body.reason || 'Cancelled by user';
    const basePercent = CANCEL_FEE[order.orderStatus] || 0;
    const state = order.shippingAddress?.state;
    const stateMultiplier = STATE_MULTIPLIER[state] || STATE_MULTIPLIER.default;
    const feePercent = Math.round(basePercent * stateMultiplier * 10) / 10;
    const cancelFee = feePercent > 0 ? Math.round(order.totalAmount * feePercent / 100) : 0;
    const refundAmount = order.totalAmount - cancelFee;

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.cancelFee = cancelFee;
    order.refundAmount = refundAmount;

    order.statusHistory.push({
      status: 'cancelled',
      note: cancelFee > 0
        ? `${reason}. Cancellation fee: ₹${cancelFee} (${feePercent}%). Refund: ₹${refundAmount}`
        : reason,
      timestamp: new Date(),
    });

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
      stateMultiplier,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, note, deliveryAgent } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    if (trackingId) order.trackingId = trackingId;
    if (deliveryAgent) order.deliveryAgent = deliveryAgent;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note: note || `Order ${status}`, timestamp: new Date() });

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reviewReturnRequest = async (req, res) => {
  try {
    const { action, adminNote = '' } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!order.returnRequest?.status) {
      return res.status(400).json({ success: false, message: 'No return or replacement request found for this order' });
    }

    if (!['approve', 'reject', 'complete'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve, reject, or complete' });
    }

    if (action === 'approve') {
      const requestType = order.returnRequest.type === 'refund' ? 'return' : order.returnRequest.type;
      order.returnRequest.type = requestType;
      order.returnRequest.reviewedAt = new Date();
      order.returnRequest.adminNote = adminNote;

      if (requestType === 'return') {
        order.returnRequest.status = 'completed';
        order.returnRequest.resolution = 'refund';
        order.returnRequest.refundInitiatedAt = new Date();
        order.paymentStatus = 'refunded';
        order.refundAmount = order.totalAmount;
        order.orderStatus = 'returned';

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }

        order.statusHistory.push({
          status: 'returned',
          note: `Return approved and refund initiated${adminNote ? `: ${adminNote}` : ''}`,
          timestamp: new Date(),
        });
      } else {
        order.returnRequest.status = 'approved';
        order.returnRequest.resolution = 'replacement';
        order.statusHistory.push({
          status: order.orderStatus,
          note: `Replacement request approved${adminNote ? `: ${adminNote}` : ''}`,
          timestamp: new Date(),
        });
      }
    }

    if (action === 'reject') {
      order.returnRequest.status = 'rejected';
      order.returnRequest.reviewedAt = new Date();
      order.returnRequest.adminNote = adminNote;
      order.statusHistory.push({
        status: order.orderStatus,
        note: `${order.returnRequest.type === 'refund' ? 'return' : order.returnRequest.type} request rejected${adminNote ? `: ${adminNote}` : ''}`,
        timestamp: new Date(),
      });
    }

    if (action === 'complete') {
      const requestType = order.returnRequest.type === 'refund' ? 'return' : order.returnRequest.type;
      if (requestType !== 'replacement') {
        return res.status(400).json({ success: false, message: 'Only replacement requests need a completion step' });
      }

      order.returnRequest.type = requestType;
      order.returnRequest.status = 'completed';
      order.returnRequest.reviewedAt = new Date();
      order.returnRequest.adminNote = adminNote;

      order.statusHistory.push({
        status: order.orderStatus,
        note: `Replacement request completed${adminNote ? `: ${adminNote}` : ''}`,
        timestamp: new Date(),
      });
    }

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestReturn = async (req, res) => {
  try {
    const { type, reason, description } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Request allowed only after delivery' });
    }
    if (!type || !RETURN_TYPES.has(type)) {
      return res.status(400).json({ success: false, message: 'Type must be return or replacement' });
    }
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required' });
    }
    if (type === 'replacement' && !REPLACEMENT_REASONS.has(reason)) {
      return res.status(400).json({ success: false, message: 'Replacement is only available for damaged, defective, or wrong product issues' });
    }
    if (order.returnRequest?.status === 'pending') {
      return res.status(400).json({ success: false, message: 'A request is already pending for this order' });
    }

    const normalizedType = type === 'refund' ? 'return' : type;

    order.returnRequest = {
      type: normalizedType,
      reason,
      description,
      status: 'pending',
      resolution: normalizedType === 'replacement' ? 'replacement' : 'refund',
      requestedAt: new Date(),
    };

    order.statusHistory.push({
      status: 'returned',
      note: `${normalizedType} requested: ${reason}`,
      timestamp: new Date(),
    });

    await order.save();
    res.status(200).json({ success: true, message: `${normalizedType} request submitted`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
