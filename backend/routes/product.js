const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { createProduct, getproduct,DeleteProduct } = require('../controllers/product');
// Route pour créer un produit avec images
router.post(
  '/',
  upload.array('images', 5),
  createProduct
);

// Route pour récupérer tous les produits
router.get('/liste', getproduct);
router.delete('/delete/:id',DeleteProduct)
module.exports = router;