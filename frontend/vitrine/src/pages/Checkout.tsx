import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconShoppingCart,
  IconLoader,
  IconAlertCircle,
  IconArrowLeft,
  IconMinus,
  IconPlus,
  IconHeart,
  IconShare,
} from "@tabler/icons-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const API_BASE_URL = "https://e-commerce-3-clba.onrender.com";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: string;
}

export default function ProductDetail() {
  const location = useLocation();
  const productFromState = location.state?.product;
  
  const [product, setProduct] = useState<Product | null>(productFromState || null);
  const [loading, setLoading] = useState(!productFromState);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  useEffect(() => {
    if (productFromState) {
      setProduct(productFromState);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const hash = window.location.hash;
        const searchParams = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(searchParams);
        const id = params.get('id');
        
        if (!id) {
          throw new Error("ID du produit manquant");
        }

        const response = await fetch(`${API_BASE_URL}/api/product/liste`);
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }
        
        const products = await response.json();
        const foundProduct = products.find((p: Product) => p._id === id);
        
        if (!foundProduct) {
          throw new Error("Produit non trouvé");
        }
        
        setProduct(foundProduct);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productFromState]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : [];

    const existingItemIndex = cart.findIndex((item: any) => item._id === product._id);

    if (existingItemIndex > -1) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        cart[existingItemIndex].quantity = newQuantity;
      } else {
        alert(`Stock insuffisant ! Maximum: ${product.stock}`);
        return;
      }
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
    
    console.log("Ajout au panier:", { product, quantity });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Découvrez ${product?.title} à ${product?.price.toLocaleString()} FCFA`,
        url: window.location.href,
      }).catch((err) => console.log("Erreur de partage:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  const categoryLabels: Record<string, string> = {
    electronics: "Électronique",
    clothing: "Vêtements",
    food: "Alimentation",
    books: "Livres",
    other: "Autre",
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div style={{ textAlign: "center" }}>
            <IconLoader
              size={50}
              style={{ animation: "spin 1s linear infinite", color: "#FF7F00" }}
            />
            <p style={{ marginTop: "1rem", color: "#666", fontSize: "1.1rem" }}>
              Chargement du produit...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="error-message">
              <IconAlertCircle size={30} />
              <span style={{ fontSize: "1.1rem" }}>{error || "Produit non trouvé"}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              className="back-button-error"
            >
              <IconArrowLeft size={20} />
              Retour aux produits
            </motion.button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const mainImage = product.images[selectedImage];
  const imageUrl = mainImage?.startsWith("http")
    ? mainImage
    : `${API_BASE_URL}${mainImage}`;

  return (
    <>
      <Header />

      {/* Notification Favoris */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="notification"
        >
          <IconHeart size={20} fill={isLiked ? "white" : "none"} />
          {isLiked ? "Produit ajouté aux favoris ❤️" : "Produit retiré des favoris"}
        </motion.div>
      )}

      {/* Notification Panier */}
      {showCartNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="notification cart-notification"
        >
          <IconShoppingCart size={20} />
          {quantity} x "{product?.title}" ajouté au panier ! 🛒
        </motion.div>
      )}

      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Bouton retour */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
            className="back-button"
          >
            <IconArrowLeft size={20} />
            Retour
          </motion.button>

          <div className="product-grid">
            {/* Galerie d'images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="image-section"
            >
              <div className="main-image-container">
                <img
                  src={imageUrl}
                  alt={product.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="400"%3E%3Crect fill="%23f0f0f0" width="100%25" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                  }}
                  className="main-image"
                />
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="thumbnails-container">
                  {product.images.map((img, index) => {
                    const thumbUrl = img?.startsWith("http")
                      ? img
                      : `${API_BASE_URL}${img}`;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${product.title} ${index + 1}`}
                          className="thumbnail-image"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Informations produit */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="info-section"
            >
              <div className="category-badge">
                {categoryLabels[product.category] || product.category}
              </div>

              <h1 className="product-title">{product.title}</h1>

              <div className="product-price">
                {product.price.toLocaleString()} FCFA
              </div>

              <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0
                  ? `✓ En stock (${product.stock} disponible${product.stock > 1 ? "s" : ""})`
                  : "✕ Rupture de stock"}
              </div>

              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{product.description}</p>
              </div>

              {/* Sélecteur de quantité */}
              <div className="quantity-section">
                <label className="quantity-label">Quantité</label>
                <div className="quantity-controls-wrapper">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-button"
                    >
                      <IconMinus size={20} />
                    </button>
                    <div className="quantity-display">{quantity}</div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="quantity-button"
                    >
                      <IconPlus size={20} />
                    </button>
                  </div>
                  <div className="total-price">
                    Prix total: <strong>{(product.price * quantity).toLocaleString()} FCFA</strong>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="action-buttons">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`add-to-cart-button ${product.stock === 0 ? 'disabled' : ''}`}
                >
                  <IconShoppingCart size={24} />
                  {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`icon-button like-button ${isLiked ? 'active' : ''}`}
                >
                  <IconHeart size={24} fill={isLiked ? "white" : "none"} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="icon-button share-button"
                >
                  <IconShare size={24} />
                </motion.button>
              </div>

              {/* Informations supplémentaires */}
              <div className="additional-info">
                <div>✓ Livraison gratuite à partir de 50 000 FCFA</div>
                <div>✓ Retour sous 14 jours</div>
                <div>✓ Garantie constructeur</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-container {
          min-height: 100vh;
          background: #FAFAFA;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-container {
          min-height: 100vh;
          background: #FAFAFA;
          padding: 3rem 1.5rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          background: #FEE;
          border-radius: 12px;
          color: #C33;
          margin-bottom: 2rem;
        }

        .back-button-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #FF7F00;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin: 0 auto;
        }

        .notification {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 9999;
          background: #FF7F00;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .cart-notification {
          background: #4CAF50;
        }

        .product-detail-container {
          min-height: 100vh;
          background: #FAFAFA;
          padding: 2rem 1.5rem 3rem;
          font-family: 'Work Sans', sans-serif;
        }

        .product-detail-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          color: #666;
          border: 1px solid #E0E0E0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 2.5rem;
          margin-top: 3rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
          align-items: start;
        }

        .image-section {
          width: 100%;
        }

        .main-image-container {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .main-image {
          width: 100%;
          height: 450px;
          object-fit: contain;
          border-radius: 12px;
        }

        .thumbnails-container {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .thumbnail {
          min-width: 90px;
          height: 90px;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          cursor: pointer;
          border: 2px solid #E0E0E0;
          transition: all 0.2s ease;
        }

        .thumbnail.active {
          border: 3px solid #FF7F00;
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .info-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          height: fit-content;
        }

        .category-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: #FFF3E0;
          color: #FF7F00;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .product-price {
          font-size: 2rem;
          font-weight: 700;
          color: #FF7F00;
          margin-bottom: 1.5rem;
        }

        .stock-status {
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .stock-status.in-stock {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .stock-status.out-of-stock {
          background: #FFEBEE;
          color: #C62828;
        }

        .description-section {
          border-top: 1px solid #E0E0E0;
          border-bottom: 1px solid #E0E0E0;
          padding: 1.5rem 0;
          margin-bottom: 1.5rem;
        }

        .description-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 0.75rem;
        }

        .description-text {
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
        }

        .quantity-section {
          margin-bottom: 1.5rem;
        }

        .quantity-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 0.75rem;
        }

        .quantity-controls-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid #E0E0E0;
          border-radius: 10px;
          overflow: hidden;
        }

        .quantity-button {
          padding: 0.75rem 1rem;
          background: white;
          border: none;
          cursor: pointer;
          color: #1A1A1A;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .quantity-button:disabled {
          cursor: not-allowed;
          color: #ccc;
        }

        .quantity-display {
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          font-weight: 700;
          border-left: 2px solid #E0E0E0;
          border-right: 2px solid #E0E0E0;
        }

        .total-price {
          font-size: 0.9rem;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .add-to-cart-button {
          flex: 1;
          padding: 0.875rem;
          background: #FF7F00;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 16px rgba(255,127,0,0.3);
        }

        .add-to-cart-button svg {
          width: 20px;
          height: 20px;
        }

        .add-to-cart-button.disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        .icon-button {
          padding: 0.875rem;
          background: white;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .icon-button svg {
          width: 20px;
          height: 20px;
        }

        .like-button {
          color: #FF7F00;
          border-color: #FF7F00;
        }

        .like-button.active {
          background: #FF7F00;
          color: white;
        }

        .share-button {
          color: #666;
        }

        .additional-info {
          padding: 1rem;
          background: #F5F5F5;
          border-radius: 12px;
          font-size: 0.85rem;
          color: #666;
        }

        .additional-info > div {
          margin-bottom: 0.5rem;
        }

        .additional-info > div:last-child {
          margin-bottom: 0;
        }

        /* Media Queries pour Mobile */
        @media (max-width: 768px) {
          .product-detail-container {
            padding: 1rem 1rem 2rem;
          }

          .back-button {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
            margin-top: 4rem;
          }

          .product-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .main-image-container {
            padding: 1rem;
          }

          .main-image {
            height: 300px;
          }

          .thumbnails-container {
            gap: 0.5rem;
          }

          .thumbnail {
            min-width: 70px;
            height: 70px;
            padding: 0.3rem;
          }

          .info-section {
            padding: 1.5rem;
          }

          .product-title {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
          }

          .product-price {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .category-badge {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
          }

          .stock-status {
            padding: 0.75rem;
            font-size: 0.85rem;
            margin-bottom: 1rem;
          }

          .description-section {
            padding: 1rem 0;
            margin-bottom: 1rem;
          }

          .description-title {
            font-size: 1rem;
          }

          .description-text {
            font-size: 0.9rem;
          }

          .quantity-controls-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .quantity-controls {
            width: 100%;
            justify-content: space-between;
          }

          .quantity-button {
            padding: 0.6rem 0.8rem;
          }

          .quantity-display {
            padding: 0.6rem 1.2rem;
            font-size: 1.1rem;
          }

          .total-price {
            font-size: 0.85rem;
            width: 100%;
          }

          .action-buttons {
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .add-to-cart-button {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
          }

          .add-to-cart-button svg {
            width: 22px;
            height: 22px;
          }

          .icon-button {
            flex: 1;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon-button svg {
            width: 22px;
            height: 22px;
          }

          .additional-info {
            padding: 0.75rem;
            font-size: 0.8rem;
          }

          .notification {
            top: 80px;
            right: 10px;
            left: 10px;
            padding: 0.875rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        /* Très petits écrans */
        @media (max-width: 480px) {
          .product-title {
            font-size: 1.3rem;
          }

          .product-price {
            font-size: 1.3rem;
          }

          .main-image {
            height: 250px;
          }

          .thumbnail {
            min-width: 60px;
            height: 60px;
          }

          .info-section {
            padding: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}