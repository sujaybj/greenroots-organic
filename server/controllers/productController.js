const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const parseBoolean = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
};

const parseNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseArrayField = (value, fallback = []) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

// @desc    Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, rating, page = 1, limit = 12, featured } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured)  query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const sortOptions = {
      newest:      { createdAt: -1 },
      'price-low': { discountPrice: 1, price: 1 },
      'price-high':{ discountPrice: -1, price: -1 },
      rating:      { rating: -1 },
      popular:     { numReviews: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };
    const skip   = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.status(200).json({ success: true, products, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const canUserReviewProduct = async (userId, productId) => {
  const deliveredOrder = await Order.findOne({
    user: userId,
    orderStatus: 'delivered',
    'items.product': productId,
  }).select('_id');

  return Boolean(deliveredOrder);
};

// @desc    Get categories with counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check delivery to pincode/state (PUBLIC)
// @route   GET /api/products/:id/delivery-check?pincode=560001&state=Karnataka
exports.checkDelivery = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('deliverableAreas isNationwide deliveryNote name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { pincode, state } = req.query;
    const result = product.isDeliverableTo(pincode, state);

    res.status(200).json({
      success: true,
      deliverable:  result.deliverable,
      note:         result.note,
      productName:  product.name,
      isNationwide: product.isNationwide,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery areas (ADMIN)
// @route   PUT /api/products/:id/delivery-areas
exports.updateDeliveryAreas = async (req, res) => {
  try {
    const { deliverableAreas, isNationwide, deliveryNote } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deliverableAreas, isNationwide, deliveryNote },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const images = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
    const product = await Product.create({ ...req.body, images, createdBy: req.user._id });
    res.status(201).json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Update product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const previousStock = product.stock;

    const retainImages = parseArrayField(req.body.retainImages, product.images || []);
    const uploadedImages = req.files?.map((f) => ({ url: f.path, publicId: f.filename })) || [];
    const images = [...retainImages, ...uploadedImages];

    const updatePayload = {
      ...req.body,
      name: req.body.name ?? product.name,
      description: req.body.description ?? product.description,
      shortDescription: req.body.shortDescription ?? product.shortDescription,
      category: req.body.category ?? product.category,
      unit: req.body.unit ?? product.unit,
      tags: parseArrayField(req.body.tags, product.tags || []),
      certifications: parseArrayField(req.body.certifications, product.certifications || []),
      ingredients: parseArrayField(req.body.ingredients, product.ingredients || []),
      price: parseNumber(req.body.price, product.price),
      discountPrice: parseNumber(req.body.discountPrice, product.discountPrice),
      stock: parseNumber(req.body.stock, product.stock),
      isActive: parseBoolean(req.body.isActive, product.isActive),
      isFeatured: parseBoolean(req.body.isFeatured, product.isFeatured),
      images,
    };

    product = await Product.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true });

    if (previousStock === 0 && product.stock > 0) {
      await User.updateMany(
        { wishlist: product._id },
        {
          $push: {
            notifications: {
              type: 'restock',
              title: 'Back in stock',
              message: `${product.name} is available again. You can buy it now.`,
              product: product._id,
            },
          },
        }
      );
    }

    res.status(200).json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Delete product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const eligible = await canUserReviewProduct(req.user._id, product._id);
    if (!eligible) {
      return res.status(403).json({ success: false, message: 'You can review this product only after it has been delivered to you' });
    }

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating, title, comment });
    product.updateRating();
    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviewEligibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('_id');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const canReview = await canUserReviewProduct(req.user._id, product._id);
    res.status(200).json({ success: true, canReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
