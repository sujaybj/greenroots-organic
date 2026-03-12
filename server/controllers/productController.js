const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products with filter/sort/pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, rating, page = 1, limit = 12, featured } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured) query.isFeatured = true;
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
      'newest': { createdAt: -1 },
      'price-low': { discountPrice: 1, price: 1 },
      'price-high': { discountPrice: -1, price: -1 },
      'rating': { rating: -1 },
      'popular': { numReviews: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true, products, total,
      page: Number(page), pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const images = req.files?.map(file => ({ url: file.path, publicId: file.filename })) || [];
    const product = await Product.create({ ...req.body, images, createdBy: req.user._id });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.files?.length > 0) {
      const newImages = req.files.map(file => ({ url: file.path, publicId: file.filename }));
      req.body.images = [...(product.images || []), ...newImages];
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Delete images from cloudinary
    for (const image of product.images) {
      if (image.publicId) await cloudinary.uploader.destroy(image.publicId);
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/products/:id/review
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Product already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating, title, comment });
    product.updateRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories with counts
// @route   GET /api/products/categories
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
