const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');
const { deductStock } = require('./orderController');

// @desc    Create a Razorpay order for a given internal order id
// @route   POST /api/payment/razorpay/order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.round(order.totalPrice * 100), // paise
    currency: 'INR',
    receipt: order._id.toString(),
    notes: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  order.paymentResult = { ...order.paymentResult, razorpayOrderId: razorpayOrder.id };
  await order.save();

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: order._id,
  });
});

// @desc    Verify Razorpay payment signature and mark order paid
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed: signature mismatch');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = 'Confirmed';
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  };

  await order.save();
  await deductStock(order);

  res.json({ message: 'Payment verified successfully', order });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
