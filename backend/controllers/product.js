const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

exports.CreateProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    console.log('Données reçues:', req.body);
    console.log('Fichiers reçus:', req.files);

    // Validation des champs obligatoires
    if (!title || !description || !price || !category) {
      // Supprimer les fichiers uploadés si validation échoue
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, () => {});
        });
      }
      return res.status(400).json({
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier qu'il y a au moins une image
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Au moins une image est requise'
      });
    }

    // Créer les URLs des images correspondant au dossier Multer
    const images = req.files.map(file => `/uploads/products/${file.filename}`);

    const product = new Product({
      title,
      description,
      price: Number(price),       // convertir en nombre
      category,
      stock: Number(stock) || 0,  // convertir en nombre, default 0
      images
    });

    await product.save();

    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });

  } catch (error) {
    console.error('Erreur CreateProduct:', error);

    // Supprimer les fichiers uploadés en cas d'erreur
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, () => {});
      });
    }

    res.status(500).json({
      error: 'Erreur serveur lors de la création du produit',
      details: error.message
    });
  }
};


exports.getproduct= async (req,res,next) => {

try{

  const products= await Product.find()
  .lean()
  res.status(200).json(products)

}


catch (error){
 console.error("Erreur ProductList:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des produits", 
      error: error.message 
    });
}
}