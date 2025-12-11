const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    const imageUrls = req.files.map(file => file.path); // URL Cloudinary

    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      images: imageUrls
    });

    await product.save();

    res.status(201).json({
      message: "Produit créé avec succès",
      product: product._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
