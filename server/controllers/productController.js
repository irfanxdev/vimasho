const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get products with filters, sorting, search, pagination
// @route   GET /api/products
// @access  Public
// Query params: keyword, category, fit, occasion, size, color, minPrice, maxPrice, sort, page, limit, featured, newArrival
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    fit,
    occasion,
    size,
    color,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    featured,
    newArrival,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) {
    query.category = { $in: category.split(',') };
  }
  if (fit) {
    query.fit = { $in: fit.split(',') };
  }
  if (occasion) {
    query.occasion = { $in: occasion.split(',') };
  }
  if (size) {
    query['variants.sizes.size'] = { $in: size.split(',') };
  }
  if (color) {
    query['variants.color'] = { $in: color.split(',') };
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') query.isFeatured = true;
  if (newArrival === 'true') query.isNewArrival = true;

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .limit(limitNum)
    .skip(limitNum * (pageNum - 1));

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    total: count,
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('reviews.user', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc    Get distinct filter facets (categories present, colors, sizes, price range)
// @route   GET /api/products/facets
// @access  Public
const getFacets = asyncHandler(async (req, res) => {
  const colors = await Product.distinct('variants.color', { isActive: true });
  const sizes = await Product.distinct('variants.sizes.size', { isActive: true });
  const priceStats = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
  ]);
  res.json({
    colors,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'].filter((s) => sizes.includes(s)),
    priceRange: priceStats[0] ? { min: priceStats[0].min, max: priceStats[0].max } : { min: 0, max: 50000 },
  });
});

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// --- Admin ---

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Get single product by id (admin edit form)
// @route   GET /api/products/id/:id
// @access  Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

module.exports = {
  getProducts,
  getProductBySlug,
  getFacets,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
