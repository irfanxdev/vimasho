const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  addAddress,
  deleteAddress,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/me/addresses', protect, addAddress);
router.delete('/me/addresses/:addressId', protect, deleteAddress);

module.exports = router;
