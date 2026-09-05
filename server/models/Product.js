const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    colorHex: { type: String, default: '#0F2A1D' },
    sizes: [
      {
        size: { type: String, required: true }, // S, M, L, XL, XXL
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],
    images: [{ type: String, required: true }],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    fit: { type: String, enum: ['Slim', 'Regular', 'Relaxed', 'Classic'], default: 'Regular' },
    occasion: {
      type: [String],
      enum: ['Wedding', 'Festive', 'Sangeet', 'Reception', 'Casual', 'Formal', 'Haldi'],
      default: ['Festive'],
    },
    fabric: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    variants: [variantSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    stockCount: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  // Keep an aggregate stockCount in sync for quick "in stock" checks/filters
  if (this.variants && this.variants.length) {
    this.stockCount = this.variants.reduce((sum, v) => {
      return sum + v.sizes.reduce((s, sz) => s + sz.stock, 0);
    }, 0);
  }
  next();
});

productSchema.methods.effectivePrice = function () {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
};

module.exports = mongoose.model('Product', productSchema);
