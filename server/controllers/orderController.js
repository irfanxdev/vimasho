const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create a new order (called after cart review, before payment)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Recompute prices server-side from the database — never trust client-sent prices
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    const quantity = Number(item.quantity);
    if (!item.product || !item.size || !item.color || !Number.isInteger(quantity) || quantity < 1) {
      res.status(400);
      throw new Error('Each order item must include a valid product, size, color and quantity');
    }

    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    const variant = product.variants.find((v) => v.color === item.color);
    const sizeEntry = variant && variant.sizes.find((s) => s.size === item.size);
    if (!variant || !sizeEntry || sizeEntry.stock < quantity) {
      res.status(400);
      throw new Error(`${product.name} (${item.color}, ${item.size}) does not have enough stock`);
    }
    const unitPrice =
      Number(product.discountPrice) > 0 && product.discountPrice < product.price
        ? Number(product.discountPrice)
        : Number(product.price);
    itemsPrice += unitPrice * quantity;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: variant.images?.[0] || '/catalog/craft-banner.svg',
      size: item.size,
      color: item.color,
      quantity,
      price: unitPrice,
    });
  }

  const shippingPrice = itemsPrice > 2999 ? 0 : 149;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'razorpay',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});

// @desc    Deduct stock after a successfully paid order
// @access  internal (called from payment controller)
const deductStock = async (order) => {
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    const variant = product.variants.find((v) => v.color === item.color);
    const sizeEntry = variant && variant.sizes.find((s) => s.size === item.size);
    if (sizeEntry) {
      sizeEntry.stock = Math.max(0, sizeEntry.stock - item.quantity);
    }
    await product.save();
  }
};

// ---------- ADMIN ----------

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status || order.status;
  if (order.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  const updated = await order.save();
  res.json(updated);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deductStock,
};
