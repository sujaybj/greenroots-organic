const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

const TARGET_CATEGORIES = ['Electronics', 'Household'];
const FALLBACK_IMAGE_BY_PRODUCT = {
  'EcoSmart LED Bulb 12W': 'https://picsum.photos/id/1060/1200/900.jpg',
  'Portable Rechargeable Emergency Light': 'https://picsum.photos/id/1040/1200/900.jpg',
  'Stainless Steel Insulated Water Bottle 1L': 'https://picsum.photos/id/30/1200/900.jpg',
  'Natural Floor Cleaner Lemon 1L': 'https://picsum.photos/id/29/1200/900.jpg',
  'Microfiber Cleaning Cloth Set (Pack of 4)': 'https://picsum.photos/id/365/1200/900.jpg',
  'USB Power Strip with 3 Sockets': 'https://picsum.photos/id/180/1200/900.jpg',
};

const isAlreadyCloudinary = (url = '') =>
  typeof url === 'string' &&
  url.includes('res.cloudinary.com') &&
  (process.env.CLOUDINARY_CLOUD_NAME ? url.includes(process.env.CLOUDINARY_CLOUD_NAME.trim()) : true);

const shouldMigrateImage = (image = {}) => {
  if (!image.url) return false;
  if (isAlreadyCloudinary(image.url)) return false;
  if (!image.publicId) return true;
  return String(image.publicId).startsWith('ext-');
};

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({
    category: { $in: TARGET_CATEGORIES },
    isActive: true,
  });

  let productCount = 0;
  let imageCount = 0;

  const failures = [];

  for (const product of products) {
    let changed = false;
    const nextImages = [];

    for (const image of product.images || []) {
      if (!shouldMigrateImage(image)) {
        nextImages.push(image);
        continue;
      }

      let uploaded;
      try {
        uploaded = await cloudinary.uploader.upload(image.url, {
          folder: 'organic-app/products',
          resource_type: 'image',
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        });
      } catch (err) {
        const fallbackUrl = FALLBACK_IMAGE_BY_PRODUCT[product.name];
        if (!fallbackUrl) {
          failures.push({ product: product.name, url: image.url, reason: err.message });
          nextImages.push(image);
          continue;
        }
        uploaded = await cloudinary.uploader.upload(fallbackUrl, {
          folder: 'organic-app/products',
          resource_type: 'image',
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        });
      }

      nextImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
      imageCount += 1;
      changed = true;
      console.log(`Uploaded image for "${product.name}" -> ${uploaded.public_id}`);
    }

    if (changed) {
      product.images = nextImages;
      await product.save();
      productCount += 1;
    }
  }

  console.log(`Migration complete. Products updated: ${productCount}, Images uploaded: ${imageCount}`);
  if (failures.length > 0) {
    console.log('Some images could not be migrated:');
    failures.forEach((f) => {
      console.log(`- ${f.product}: ${f.reason}`);
    });
  }
  await mongoose.disconnect();
};

migrate().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
