const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductBySlug,
  getFacets,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require('../controllers/productController');

router.get('/facets', getFacets);
router.get('/id/:id', protect, admin, getProductById);
router.get('/:slug', getProductBySlug);
router.get('/', getProducts);

router.post('/:id/reviews', protect, createReview);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
