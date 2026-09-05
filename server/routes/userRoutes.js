const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getWishlist,
  toggleWishlist,
  getUsers,
} = require('../controllers/userController');

router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:itemId', protect, updateCartItem);
router.delete('/cart/:itemId', protect, removeCartItem);
router.delete('/cart', protect, clearCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);

router.get('/', protect, admin, getUsers);

module.exports = router;
