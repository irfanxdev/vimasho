const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// ---------- CART ----------

// @desc    Get current user's cart, populated with live product data
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
});

// @desc    Add an item to cart without changing an existing item's quantity
// @route   POST /api/users/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const variant = product.variants.find((v) => v.color === color);
  const sizeEntry = variant && variant.sizes.find((s) => s.size === size);
  if (!variant || !sizeEntry || sizeEntry.stock < 1) {
    res.status(400);
    throw new Error('Selected size/color is out of stock');
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find(
    (item) => item.product.toString() === productId && item.size === size && item.color === color
  );

  if (!existing) {
    user.cart.push({ product: productId, size, color, quantity: Number(quantity) });
  }

  await user.save();
  const populated = await user.populate('cart.product');
  res.status(201).json(populated.cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }
  item.quantity = Math.max(1, Number(quantity));
  await user.save();
  const populated = await user.populate('cart.product');
  res.json(populated.cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item._id.toString() !== req.params.itemId);
  await user.save();
  const populated = await user.populate('cart.product');
  res.json(populated.cart);
});

// @desc    Clear entire cart (used after successful order)
// @route   DELETE /api/users/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json([]);
});

// ---------- WISHLIST ----------

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});

// @desc    Toggle a product in wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  const populated = await user.populate('wishlist');
  res.json(populated.wishlist);
});

// ---------- ADMIN ----------

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getWishlist,
  toggleWishlist,
  getUsers,
};
