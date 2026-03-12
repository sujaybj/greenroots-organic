const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
  description: { type: String, required: [true, 'Description is required'], maxlength: 2000 },
  shortDescription: { type: String, maxlength: 300 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: {
    type: String, required: true,
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Pulses', 'Spices', 'Oils', 'Beverages', 'Skincare', 'Other']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
  }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, default: 'kg', enum: ['kg', 'g', 'litre', 'ml', 'piece', 'pack', 'dozen'] },
  ingredients: [String],
  certifications: [{ type: String, enum: ['USDA Organic', 'India Organic', 'FSSAI', 'Non-GMO', 'Fair Trade', 'Vegan'] }],
  nutritionInfo: {
    calories: Number, protein: String, carbs: String,
    fat: String, fiber: String, vitamins: String,
  },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
}, { timestamps: true });

// Update avg rating on review change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const avg = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.rating = Math.round(avg * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
