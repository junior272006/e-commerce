const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { createProduct, getproduct } = require('../controllers/product');

// Upload max 5 images vers Cloudinary
router.post('/', upload.array('images', 5), createProduct);

router.get('/liste', getproduct);

module.exports = router;
