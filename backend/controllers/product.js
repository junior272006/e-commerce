const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  try {
    console.log('===== DEBUT CREATION PRODUIT =====');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('==================================');

    // Validation des fichiers
    if (!req.files || req.files.length === 0) {
      console.log('ERREUR: Aucune image reçue');
      return res.status(400).json({
        success: false,
        message: "Aucune image reçue"
      });
    }

    // Récupération des URLs Cloudinary
    const images = req.files.map(file => file.path);
    console.log('URLs Cloudinary:', images);

    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock || 0),
      images
    });

    await product.save();
    console.log('Produit sauvegardé avec succès:', product._id);

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product
    });

  } catch (error) {
    console.error('ERREUR création produit:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getproduct = async (req, res) => {
  try {
    const products = await Product.find().lean();
    console.log('Produits récupérés:', products.length);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur ProductList:", error);
    res.status(500).json({
      message: "Erreur récupération produits",
      error: error.message
    });
  }
};


exports.DeleteProduct = async (req, res, next) => {
  try {
    // ✅ Prendre l'ID depuis le body au lieu de params
    const { id } = req.body;

    const result = await Product.deleteOne({ _id: id })
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};