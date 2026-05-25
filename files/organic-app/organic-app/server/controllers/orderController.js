const Order   = require('../models/Order');
const Product = require('../models/Product');

// ── Cancellation fee by stage ──────────────────────────────────
const CANCEL_FEE = { placed:0, confirmed:0, packed:5, shipped:10, outForDelivery:15 };

// ── @desc Create order ─────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success:false, message:`Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ success:false, message:`Insufficient stock for "${product.name}". Available: ${product.stock}` });
      if (product.stock === 0) return res.status(400).json({ success:false, message:`"${product.name}" is out of stock.` });

      const price = product.discountPrice || product.price;
      itemsPrice += price * item.quantity;
      orderItems.push({ product:product._id, name:product.name, image:product.images?.[0]?.url||'', price, quantity:item.quantity, unit:product.unit });
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    let discountAmount = 0;
    if (couponCode) {
      try {
        const Coupon = require('../models/Coupon');
        const coupon = await Coupon.findOne({ code:couponCode.toUpperCase(), isActive:true });
        if (coupon && itemsPrice >= coupon.minOrderAmount)
          discountAmount = coupon.discountType==='percentage' ? Math.round(itemsPrice*coupon.discountValue/100) : coupon.discountValue;
      } catch {}
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalAmount   = itemsPrice + shippingPrice - discountAmount;

    const order = await Order.create({
      user:req.user._id, items:orderItems, shippingAddress, paymentMethod,
      itemsPrice, shippingPrice, taxPrice:0, discountAmount, totalAmount, couponCode,
      orderStatus:'placed', paymentStatus: paymentMethod==='cod' ? 'pending' : 'pending',
      statusHistory:[{ status:'placed', note:'Order placed successfully', timestamp:new Date() }],
    });

    res.status(201).json({ success:true, order });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

// ── @desc Get user orders ──────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user:req.user._id }).sort({ createdAt:-1 });
    res.status(200).json({ success:true, orders });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

exports.getUserOrders = exports.getMyOrders;

// ── @desc Get single order ─────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user','name email phone');
    if (!order) return res.status(404).json({ success:false, message:'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success:false, message:'Not authorized' });
    res.status(200).json({ success:true, order });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

exports.getOrderById = exports.getOrder;

// ── @desc Cancel order ─────────────────────────────────────────
// COD orders: can only cancel before "packed" (placed/confirmed only)
// Online orders: can cancel up to outForDelivery with fee
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success:false, message:'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' });
    if (['cancelled','delivered','returned'].includes(order.orderStatus))
      return res.status(400).json({ success:false, message:`Order is already ${order.orderStatus}` });

    // ── COD restriction: cannot cancel after confirmed ────────
    if (order.paymentMethod === 'cod' && !['placed','confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success:false,
        message:`COD orders cannot be cancelled after "${order.orderStatus}" stage. Please contact support.`,
      });
    }

    const reason       = req.body.reason || 'Cancelled by user';
    const feePercent   = CANCEL_FEE[order.orderStatus] || 0;
    const cancelFee    = feePercent > 0 ? Math.round(order.totalAmount * feePercent / 100) : 0;
    const refundAmount = order.totalAmount - cancelFee;

    order.orderStatus  = 'cancelled';
    order.cancelledAt  = new Date();
    order.cancelReason = reason;
    order.cancelFee    = cancelFee;
    order.refundAmount = refundAmount;

    // If paid online, mark for refund
    if (order.paymentStatus === 'paid' && refundAmount > 0) {
      order.paymentStatus = 'refunded';
      order.refundStatus  = 'processing';
    }

    order.statusHistory.push({
      status:'cancelled',
      note: cancelFee > 0
        ? `${reason}. Fee: ₹${cancelFee} (${feePercent}%). Refund: ₹${refundAmount}`
        : reason,
      timestamp:new Date(),
    });

    // Auto restock
    for (const item of order.items)
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });

    await order.save();
    res.status(200).json({ success:true, message:'Order cancelled. Refund will be processed in 5-7 days.', cancelFee, refundAmount, order });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

// ── @desc Request return/refund/exchange ──────────────────────
// Only allowed after "delivered" status
exports.requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success:false, message:'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Not authorized' });
    if (order.orderStatus !== 'delivered')
      return res.status(400).json({ success:false, message:'Return/Refund only allowed after delivery.' });

    // 7-day return window
    const deliveredAt = order.deliveredAt || new Date(order.updatedAt);
    const daysSince   = (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 7)
      return res.status(400).json({ success:false, message:'Return window expired. Returns accepted within 7 days of delivery.' });

    const { type, reason, bankAccount } = req.body;
    // type: 'return' | 'refund' | 'exchange'
    if (!type)   return res.status(400).json({ success:false, message:'Return type required (return/refund/exchange)' });
    if (!reason) return res.status(400).json({ success:false, message:'Reason is required' });

    order.returnRequest = {
      type,
      reason,
      status:      'requested',
      requestedAt: new Date(),
      bankAccount: bankAccount || null,
      refundAmount: order.totalAmount,
    };
    order.orderStatus = 'returned';
    order.paymentStatus = type !== 'exchange' ? 'refunded' : order.paymentStatus;
    order.refundStatus  = type !== 'exchange' ? 'processing' : 'na';

    order.statusHistory.push({
      status:'returned',
      note:`${type.toUpperCase()} requested: ${reason}`,
      timestamp:new Date(),
    });

    // Restock on return
    if (type === 'return' || type === 'exchange') {
      for (const item of order.items)
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    await order.save();
    res.status(200).json({ success:true, message:`${type} request submitted. We'll process it in 2-3 business days.`, order });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

// ── @desc Admin update order status ───────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, note, deliveryAgent } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success:false, message:'Order not found' });

    order.orderStatus = status;
    if (trackingId)    order.trackingId    = trackingId;
    if (deliveryAgent) order.deliveryAgent = deliveryAgent;
    if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus; }
    order.statusHistory.push({ status, note:note||`Order ${status}`, timestamp:new Date() });

    await order.save();
    res.status(200).json({ success:true, order });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

// ── @desc Admin get all orders ─────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const { page=1, limit=20, status, paymentStatus } = req.query;
    const query = {};
    if (status)        query.orderStatus   = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const skip = (Number(page)-1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user','name email').sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    res.status(200).json({ success:true, orders, total, pages:Math.ceil(total/Number(limit)) });
  } catch (error) { res.status(500).json({ success:false, message:error.message }); }
};
