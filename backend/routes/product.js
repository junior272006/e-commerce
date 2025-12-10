const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { CreateProduct } = require('../controllers/product');

// Route pour créer un produit avec upload d'images (max 5)
router.post('/', upload.array('images', 5), CreateProduct);




module.exports = router;