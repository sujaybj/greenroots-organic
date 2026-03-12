const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  discountValue: { type: Number, required: true, min: 1 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number }, // cap for percent type
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  description: String,
}, { timestamps: true });

couponSchema.methods.isValid = function (orderAmount, userId) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > this.expiryDate) return { valid: false, message: 'Coupon has expired' };
  if (this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount) return { valid: false, message: `Minimum order amount is ₹${this.minOrderAmount}` };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'You have already used this coupon' };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.discountType === 'flat') return Math.min(this.discountValue, orderAmount);
  const discount = (orderAmount * this.discountValue) / 100;
  return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
};

module.exports = mongoose.model('Coupon', couponSchema);
