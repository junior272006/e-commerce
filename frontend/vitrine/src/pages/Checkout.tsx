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
    // Si le produit est déjà dans l'état, pas besoin de charger
    if (productFromState) {
      setProduct(productFromState);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        // Récupérer l'ID depuis l'URL hash
        const hash = window.location.hash; // Ex: #/product-detail?id=123
        const searchParams = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(searchParams);
        const id = params.get('id');
        
        if (!id) {
          throw new Error("ID du produit manquant");
        }

        // Charger tous les produits et trouver celui qui correspond
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
    
    // Récupérer le panier actuel
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : [];

    // Vérifier si le produit existe déjà
    const existingItemIndex = cart.findIndex((item: any) => item._id === product._id);

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        cart[existingItemIndex].quantity = newQuantity;
      } else {
        alert(`Stock insuffisant ! Maximum: ${product.stock}`);
        return;
      }
    } else {
      // Ajouter le nouveau produit
      cart.push({ ...product, quantity });
    }

    // Sauvegarder dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Afficher la notification
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
    
    // Masquer la notification après 3 secondes
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
      // Fallback : copier le lien
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
        <div
          style={{
            minHeight: "100vh",
            background: "#FAFAFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "100vh",
            background: "#FAFAFA",
            padding: "3rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "2rem",
                background: "#FEE",
                borderRadius: "12px",
                color: "#C33",
                marginBottom: "2rem",
              }}
            >
              <IconAlertCircle size={30} />
              <span style={{ fontSize: "1.1rem" }}>{error || "Produit non trouvé"}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.5rem",
                background: "#FF7F00",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                margin: "0 auto",
              }}
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
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            zIndex: 9999,
            background: isLiked ? "#FF7F00" : "#666",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        >
          <IconHeart size={20} fill={isLiked ? "white" : "none"} />
          {isLiked ? "Produit ajouté aux favoris " : "Produit retiré des favoris"}
        </motion.div>
      )}

      {/* Notification Panier */}
      {showCartNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            zIndex: 9999,
            background: "#4CAF50",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        >
          <IconShoppingCart size={20} />
          {quantity} x "{product?.title}" ajouté au panier ! 🛒
        </motion.div>
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "#FAFAFA",
          padding: "2rem 1.5rem 3rem",
          fontFamily: "Work Sans, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Bouton retour */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              background: "white",
              color: "#666",
              border: "1px solid #E0E0E0",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "2.5rem",
              marginTop: "2rem",
            }}
          >
            <IconArrowLeft size={20} />
            Retour
          </motion.button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Galerie d'images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "2rem",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={imageUrl}
                  alt={product.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="400"%3E%3Crect fill="%23f0f0f0" width="100%25" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                  }}
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "contain",
                    borderRadius: "12px",
                  }}
                />
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    overflowX: "auto",
                    padding: "0.5rem 0",
                  }}
                >
                  {product.images.map((img, index) => {
                    const thumbUrl = img?.startsWith("http")
                      ? img
                      : `${API_BASE_URL}${img}`;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        style={{
                          minWidth: "90px",
                          height: "90px",
                          background: "white",
                          borderRadius: "12px",
                          padding: "0.5rem",
                          cursor: "pointer",
                          border:
                            selectedImage === index
                              ? "3px solid #FF7F00"
                              : "2px solid #E0E0E0",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${product.title} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
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
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                height: "fit-content",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1rem",
                  background: "#FFF3E0",
                  color: "#FF7F00",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                {categoryLabels[product.category] || product.category}
              </div>

              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#1A1A1A",
                  marginBottom: "1rem",
                  lineHeight: 1.2,
                }}
              >
                {product.title}
              </h1>

              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#FF7F00",
                  marginBottom: "1.5rem",
                }}
              >
                {product.price.toLocaleString()} FCFA
              </div>

              <div
                style={{
                  padding: "1rem",
                  background: product.stock > 0 ? "#E8F5E9" : "#FFEBEE",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: product.stock > 0 ? "#2E7D32" : "#C62828",
                    fontWeight: "600",
                  }}
                >
                  {product.stock > 0
                    ? `✓ En stock (${product.stock} disponible${product.stock > 1 ? "s" : ""})`
                    : "✕ Rupture de stock"}
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #E0E0E0",
                  borderBottom: "1px solid #E0E0E0",
                  padding: "1.5rem 0",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "0.75rem",
                  }}
                >
                  Description
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {product.description}
                </p>
              </div>

              {/* Sélecteur de quantité */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#1A1A1A",
                    marginBottom: "0.75rem",
                  }}
                >
                  Quantité
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid #E0E0E0",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      style={{
                        padding: "0.75rem 1rem",
                        background: "white",
                        border: "none",
                        cursor: quantity <= 1 ? "not-allowed" : "pointer",
                        color: quantity <= 1 ? "#ccc" : "#1A1A1A",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                      }}
                    >
                      <IconMinus size={20} />
                    </button>
                    <div
                      style={{
                        padding: "0.75rem 1.5rem",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        borderLeft: "2px solid #E0E0E0",
                        borderRight: "2px solid #E0E0E0",
                      }}
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      style={{
                        padding: "0.75rem 1rem",
                        background: "white",
                        border: "none",
                        cursor: quantity >= product.stock ? "not-allowed" : "pointer",
                        color: quantity >= product.stock ? "#ccc" : "#1A1A1A",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                      }}
                    >
                      <IconPlus size={20} />
                    </button>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>
                    Prix total: <strong>{(product.price * quantity).toLocaleString()} FCFA</strong>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1,
                    padding: "1.1rem",
                    background: product.stock === 0 ? "#ccc" : "#FF7F00",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: product.stock === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    boxShadow:
                      product.stock === 0
                        ? "none"
                        : "0 4px 16px rgba(255,127,0,0.3)",
                  }}
                >
                  <IconShoppingCart size={24} />
                  {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  style={{
                    padding: "1.1rem",
                    background: isLiked ? "#FF7F00" : "white",
                    color: isLiked ? "white" : "#FF7F00",
                    border: `2px solid #FF7F00`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <IconHeart size={24} fill={isLiked ? "white" : "none"} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  style={{
                    padding: "1.1rem",
                    background: "white",
                    color: "#666",
                    border: "2px solid #E0E0E0",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                >
                  <IconShare size={24} />
                </motion.button>
              </div>

              {/* Informations supplémentaires */}
              <div
                style={{
                  padding: "1rem",
                  background: "#F5F5F5",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  color: "#666",
                }}
              >
                <div style={{ marginBottom: "0.5rem" }}>
                  ✓ Livraison gratuite à partir de 50 000 FCFA
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  ✓ Retour sous 14 jours
                </div>
                <div>✓ Garantie constructeur</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            div[style*="gridTemplateColumns: repeat(2, 1fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </>
  );
}