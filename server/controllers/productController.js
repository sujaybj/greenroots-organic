const Product = require('../models/Product');

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
    if (req.files?.length > 0) {
      req.body.images = [...(product.images || []), ...req.files.map(f => ({ url: f.path, publicId: f.filename }))];
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
