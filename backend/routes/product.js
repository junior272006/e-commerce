const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { createProduct, getproduct } = require('../controllers/product');

// ⛑️ Middleware de protection Multer
router.post(
  '/',
  (req, res, next) => {
    upload.array('images', 5)(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  },
  createProduct
);

router.get('/liste', getproduct);

module.exports = router;
