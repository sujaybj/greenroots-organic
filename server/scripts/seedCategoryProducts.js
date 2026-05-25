const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/Product');

const products = [
  {
    name: 'EcoSmart LED Bulb 12W',
    description: 'Energy-efficient LED bulb with warm daylight output. Long lifespan and low power consumption for daily home use.',
    shortDescription: '12W energy-saving LED bulb for home lighting.',
    price: 249,
    discountPrice: 189,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1510546020578-a2919f88bc81?auto=format&fit=crop&w=900&q=80', publicId: 'ext-led-bulb-12w' }],
    stock: 120,
    unit: 'piece',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['electronics', 'led', 'lighting', 'energy-saving'],
  },
  {
    name: 'Portable Rechargeable Emergency Light',
    description: 'Compact emergency light with rechargeable battery backup and dual brightness mode for power cuts and outdoor use.',
    shortDescription: 'Rechargeable emergency light with battery backup.',
    price: 1299,
    discountPrice: 1099,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=900&q=80', publicId: 'ext-emergency-light' }],
    stock: 45,
    unit: 'piece',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['electronics', 'emergency light', 'backup', 'rechargeable'],
  },
  {
    name: 'Stainless Steel Insulated Water Bottle 1L',
    description: 'Double-wall insulated bottle that keeps water cold or hot for hours. Leak-proof cap and durable steel build.',
    shortDescription: '1L insulated stainless steel water bottle.',
    price: 899,
    discountPrice: 749,
    category: 'Household',
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', publicId: 'ext-water-bottle-1l' }],
    stock: 70,
    unit: 'piece',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['household', 'bottle', 'steel', 'kitchen'],
  },
  {
    name: 'Natural Floor Cleaner Lemon 1L',
    description: 'Plant-based floor cleaner with natural lemon fragrance. Effective on tiles, marble, and granite surfaces.',
    shortDescription: 'Plant-based lemon floor cleaner for home.',
    price: 299,
    discountPrice: 249,
    category: 'Household',
    images: [{ url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', publicId: 'ext-floor-cleaner-lemon' }],
    stock: 85,
    unit: 'litre',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['household', 'cleaner', 'floor', 'home care'],
  },
  {
    name: 'Microfiber Cleaning Cloth Set (Pack of 4)',
    description: 'Soft and reusable microfiber cloth set for dusting and surface cleaning without scratches.',
    shortDescription: 'Reusable microfiber cloth set for household cleaning.',
    price: 349,
    discountPrice: 279,
    category: 'Household',
    images: [{ url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80', publicId: 'ext-microfiber-cloth-set' }],
    stock: 95,
    unit: 'pack',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['household', 'microfiber', 'cleaning', 'reusable'],
  },
  {
    name: 'USB Power Strip with 3 Sockets',
    description: 'Compact surge-protected power strip with USB ports for charging phones and powering appliances.',
    shortDescription: '3-socket surge-protected power strip with USB.',
    price: 1499,
    discountPrice: 1249,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=80', publicId: 'ext-power-strip-usb' }],
    stock: 38,
    unit: 'piece',
    certifications: ['BIS'],
    isFeatured: false,
    isActive: true,
    tags: ['electronics', 'power strip', 'usb', 'surge protector'],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let inserted = 0;
  let updated = 0;

  for (const item of products) {
    const existing = await Product.findOne({ name: item.name });
    if (existing) {
      await Product.updateOne({ _id: existing._id }, { $set: item });
      updated += 1;
      continue;
    }
    await Product.create(item);
    inserted += 1;
  }

  const electronicsCount = await Product.countDocuments({ category: 'Electronics', isActive: true });
  const householdCount = await Product.countDocuments({ category: 'Household', isActive: true });

  console.log(`Seed complete. Inserted: ${inserted}, Updated: ${updated}`);
  console.log(`Active Electronics products: ${electronicsCount}`);
  console.log(`Active Household products: ${householdCount}`);

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
