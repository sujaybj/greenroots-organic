const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  avatar:  String,
  rating:  { type: Number, required: true, min: 1, max: 5 },
  title:   { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const deliverableAreaSchema = new mongoose.Schema({
  state:    { type: String, required: true },
  cities:   [{ type: String }],
  pincodes: [{ type: String }],
  note:     { type: String, maxlength: 200 },
  isActive: { type: Boolean, default: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:             { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
  description:      { type: String, required: [true, 'Description is required'], maxlength: 2000 },
  shortDescription: { type: String, maxlength: 300 },
  price:            { type: Number, required: [true, 'Price is required'], min: 0 },
  discountPrice:    { type: Number, min: 0 },
  category: {
    type: String, required: true,
    enum: [
      'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Pulses',
      'Spices', 'Oils', 'Beverages', 'Skincare',
      'Electronics',   // ← NEW
      'Household',     // ← NEW
      'Other',
    ],
  },
  images: [{ url: { type: String, required: true }, publicId: String }],
  stock:    { type: Number, required: true, min: 0, default: 0 },
  unit:     { type: String, default: 'piece', enum: ['kg', 'g', 'litre', 'ml', 'piece', 'pack', 'dozen'] },
  ingredients:    [String],
  certifications: [{ type: String, enum: ['USDA Organic', 'India Organic', 'FSSAI', 'Non-GMO', 'Fair Trade', 'Vegan'] }],
  nutritionInfo: {
    calories: Number, protein: String, carbs: String,
    fat: String, fiber: String, vitamins: String,
  },

  // ── Delivery ──────────────────────────────────────────────
  deliverableAreas: [deliverableAreaSchema],
  deliveryNote:     { type: String, maxlength: 300 },
  isNationwide:     { type: Boolean, default: false },

  isFeatured: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true  },
  reviews:    [reviewSchema],
  rating:     { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:       [String],
}, { timestamps: true, toJSON: { virtuals: true } });

// Indexes for performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; }
  else {
    this.rating    = Math.round(this.reviews.reduce((a,r) => a+r.rating, 0) / this.reviews.length * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

productSchema.virtual('discountPercent').get(function () {
  if (this.discountPrice && this.price > this.discountPrice)
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  return 0;
});

productSchema.methods.isDeliverableTo = function (pincode, state) {
  if (this.isNationwide || this.deliverableAreas.length === 0)
    return { deliverable: true, note: this.deliveryNote || '' };
  const active = this.deliverableAreas.filter(a => a.isActive);
  if (pincode) for (const a of active) if (a.pincodes.includes(pincode)) return { deliverable: true, note: a.note || this.deliveryNote || '' };
  if (state)   { const sa = active.find(a => a.state.toLowerCase() === state.toLowerCase()); if (sa) return { deliverable: true, note: sa.note || this.deliveryNote || '' }; }
  return { deliverable: false, note: 'Not available in your area yet.' };
};

module.exports = mongoose.model('Product', productSchema);
