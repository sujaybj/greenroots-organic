// server/seedCoupons.js
// Run: node seedCoupons.js
require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const coupons = [
  {
    code: 'ORGANIC10',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 200,
    maxDiscount: 100,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    description: '10% off on orders above ₹200',
    isActive: true,
  },
  {
    code: 'WELCOME50',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 300,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 500,
    description: '₹50 flat off on first order above ₹300',
    isActive: true,
  },
  {
    code: 'GREEN20',
    discountType: 'percent',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 150,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 200,
    description: '20% off on orders above ₹500',
    isActive: true,
  },
  {
    code: 'FRESH100',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 800,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 100,
    description: '₹100 off on orders above ₹800',
    isActive: true,
  },
  {
    code: 'NEWUSER',
    discountType: 'percent',
    discountValue: 15,
    minOrderAmount: 0,
    maxDiscount: 200,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    description: '15% off for new users',
    isActive: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Remove existing coupons
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing coupons');

    // Insert new coupons
    await Coupon.insertMany(coupons);
    console.log('✅ Coupons added successfully!\n');

    coupons.forEach(c => {
      console.log(`  🎟️  ${c.code} — ${c.description}`);
    });

    console.log('\n📋 Test these codes in your cart:');
    console.log('  ORGANIC10  → 10% off (min ₹200)');
    console.log('  WELCOME50  → ₹50 off  (min ₹300)');
    console.log('  GREEN20    → 20% off (min ₹500)');
    console.log('  FRESH100   → ₹100 off (min ₹800)');
    console.log('  NEWUSER    → 15% off  (no minimum)\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();