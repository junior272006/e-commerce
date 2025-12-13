const Product = require('../models/product');


exports.createProduct = async (req, res) => {
  try {
    console.log("BODY :", req.body);
    console.log("FILES :", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucune image envoyée"
      });
    }

    const images = req.files.map(file => file.path); // Cloudinary URL

    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images: images
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product
    });

  } catch (error) {
    console.error("ERREUR CREATE PRODUCT :", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};



exports.getproduct = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur ProductList:", error);
    res.status(500).json({
      message: "Erreur récupération produits",
      error: error.message
    });
  }
};
