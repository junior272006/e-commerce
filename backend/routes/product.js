const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { createProduct, getproduct,DeleteProduct,ModifyProduct } = require('../controllers/product');
// Route pour créer un produit avec images
router.post(
  '/',
  upload.array('images', 5),
  createProduct
);

// Route pour récupérer tous les produits
router.get('/liste', getproduct);
router.post('/delete',DeleteProduct)
router.put('/modification',ModifyProduct)
module.exports = router;