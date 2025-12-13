const Product = require('../models/product');


exports.createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucune image reçue"
      });
    }

    const images = req.files.map(file => file.path);

    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock || 0),
      images
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
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
