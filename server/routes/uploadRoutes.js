const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, handleUpload } = require('../controllers/uploadController');

router.post('/', protect, admin, upload.single('image'), handleUpload);

module.exports = router;
