import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconShoppingCart, IconLoader, IconAlertCircle, IconSearch } from "@tabler/icons-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { productlist } from "../api/authService";

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

export default function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productlist();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des produits");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Recherche par nom ou prix
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const matchName = p.title.toLowerCase().includes(query);
        const matchPrice = p.price.toString().includes(query);
        return matchName || matchPrice;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  // Navigation vers la page de détails avec React Router
  const handleProductClick = (product: Product) => {
    navigate(`/product-detail?id=${product._id}`, { 
      state: { product } 
    });
  };

  const handleBuyProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Empêche la navigation lors du clic sur "Acheter"
    
    // Récupérer le panier actuel
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : [];

    // Vérifier si le produit existe déjà
    const existingItemIndex = cart.findIndex((item: any) => item._id === product._id);

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      const newQuantity = cart[existingItemIndex].quantity + 1;
      if (newQuantity <= product.stock) {
        cart[existingItemIndex].quantity = newQuantity;
      } else {
        alert(`Stock insuffisant ! Maximum: ${product.stock}`);
        return;
      }
    } else {
      // Ajouter le nouveau produit
      cart.push({ ...product, quantity: 1 });
    }

    // Sauvegarder dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Afficher la notification
    setAddedProductName(product.title);
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
    
    console.log("Achat du produit:", product);
  };

  const categoryLabels: Record<string, string> = {
    electronics: "Électronique",
    clothing: "Vêtements",
    food: "Alimentation",
    books: "Livres",
    other: "Autre",
  };

  return (
    <>
      <Header />

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
          "{addedProductName}" ajouté au panier ! 🛒
        </motion.div>
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "#FAFAFA",
          padding: "3rem 1.5rem",
          fontFamily: "Work Sans, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1A1A1A",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Nos Produits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "1.1rem",
              color: "#666",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Découvrez notre sélection de produits
          </motion.p>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              maxWidth: "600px",
              margin: "0 auto 3rem",
              position: "relative",
            }}
          >
            <IconSearch
              size={20}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou prix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3rem",
                border: "2px solid #E0E0E0",
                borderRadius: "50px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF7F00";
                e.target.style.boxShadow = "0 4px 16px rgba(255,127,0,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E0E0E0";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#FF7F00",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ×
              </motion.button>
            )}
          </motion.div>

          {/* Résultats de recherche */}
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
              }}
            >
              {filteredProducts.length} résultat{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""} pour "{searchQuery}"
            </motion.p>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <IconLoader
                size={50}
                style={{ animation: "spin 1s linear infinite", color: "#FF7F00" }}
              />
              <p style={{ marginTop: "1rem", color: "#666", fontSize: "1.1rem" }}>
                Chargement des produits...
              </p>
            </div>
          ) : error ? (
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
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <IconAlertCircle size={30} />
              <span style={{ fontSize: "1.1rem" }}>{error}</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "#999",
                fontSize: "1.2rem",
              }}
            >
              {searchQuery 
                ? `Aucun produit trouvé pour "${searchQuery}"`
                : "Aucun produit disponible pour le moment"}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredProducts.map((product, index) => {
                const imageUrl = product.images[0];
                const finalUrl = imageUrl?.startsWith("http")
                  ? imageUrl
                  : `${API_BASE_URL}${imageUrl}`;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    onClick={() => handleProductClick(product)}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        overflow: "hidden",
                        background: index % 2 === 0 ? "#FFF3E0" : "#F5F5F5",
                      }}
                    >
                      <img
                        src={finalUrl}
                        alt={product.title}
                        onError={(e) => {
                          console.error("Erreur chargement image:", finalUrl);
                          e.currentTarget.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="180"%3E%3Crect fill="%23f0f0f0" width="100%25" height="180"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    </div>

                    <div style={{ padding: "1.25rem" }}>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          background: index % 2 === 0 ? "#FFF3E0" : "#F5F5F5",
                          color: index % 2 === 0 ? "#FF7F00" : "#8E8E8E",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {categoryLabels[product.category] || product.category}
                      </div>

                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "700",
                          color: "#1A1A1A",
                          marginBottom: "0.5rem",
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.title}
                      </h3>

                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          marginBottom: "1rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: index % 2 === 0 ? "#FF7F00" : "#8E8E8E",
                          }}
                        >
                          {product.price.toLocaleString()} FCFA
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: product.stock > 0 ? "#4CAF50" : "#F44336",
                            fontWeight: "600",
                          }}
                        >
                          {product.stock > 0
                            ? `Stock: ${product.stock}`
                            : "Rupture"}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => handleBuyProduct(e, product)}
                        disabled={product.stock === 0}
                        style={{
                          width: "100%",
                          padding: "0.875rem",
                          background:
                            product.stock === 0
                              ? "#ccc"
                              : index % 2 === 0
                              ? "#FF7F00"
                              : "#8E8E8E",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          cursor: product.stock === 0 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow:
                            product.stock === 0
                              ? "none"
                              : index % 2 === 0
                              ? "0 4px 12px rgba(255,127,0,0.25)"
                              : "0 4px 12px rgba(142,142,142,0.25)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <IconShoppingCart size={18} />
                        {product.stock === 0 ? "Indisponible" : "Acheter"}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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