import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconShoppingCart,
  IconTrash,
  IconPlus,
  IconMinus,
  IconArrowLeft,
  IconShoppingBag,
} from "@tabler/icons-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const API_BASE_URL = "https://e-commerce-3-clba.onrender.com";

interface CartItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  quantity: number;
}

export default function Shop() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const newCart = cartItems.map((item) => {
      if (item._id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity >= 1 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    updateCart(newCart);
  };

  const handleRemoveItem = (productId: string) => {
    const newCart = cartItems.filter((item) => item._id !== productId);
    updateCart(newCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    alert("Fonction de paiement à implémenter !");
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

      <div
        style={{
          minHeight: "100vh",
          background: "#FAFAFA",
          padding: "2rem 1.5rem 3rem",
          fontFamily: "Work Sans, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "2rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#1A1A1A",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <IconShoppingCart size={40} style={{ color: "#FF7F00" }} />
                Mon Panier
              </h1>
              <a
                href="#/product"
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
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FF7F00";
                  e.currentTarget.style.color = "#FF7F00";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E0E0E0";
                  e.currentTarget.style.color = "#666";
                }}
              >
                <IconArrowLeft size={20} />
                Continuer mes achats
              </a>
            </div>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              {cartItems.length === 0
                ? "Votre panier est vide"
                : `${calculateTotalItems()} article${calculateTotalItems() > 1 ? "s" : ""} dans votre panier`}
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            // Panier vide
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "4rem 2rem",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <IconShoppingBag
                size={100}
                style={{ color: "#E0E0E0", marginBottom: "2rem" }}
              />
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#1A1A1A",
                  marginBottom: "1rem",
                }}
              >
                Votre panier est vide
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
                Découvrez nos produits et ajoutez-les à votre panier !
              </p>
              <a
                href="#/product"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem 2rem",
                  background: "#FF7F00",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255,127,0,0.3)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <IconShoppingCart size={24} />
                Voir les produits
              </a>
            </motion.div>
          ) : (
            // Panier avec articles
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              {/* Liste des articles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cartItems.map((item, index) => {
                  const imageUrl = item.images[0]?.startsWith("http")
                    ? item.images[0]
                    : `${API_BASE_URL}${item.images[0]}`;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        display: "flex",
                        gap: "1.5rem",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          minWidth: "120px",
                          width: "120px",
                          height: "120px",
                          background: "#F5F5F5",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23f0f0f0" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Informations */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            background: "#FFF3E0",
                            color: "#FF7F00",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {categoryLabels[item.category] || item.category}
                        </div>

                        <h3
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            color: "#1A1A1A",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.title}
                        </h3>

                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.9rem",
                            marginBottom: "1rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Prix */}
                          <div>
                            <div
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#FF7F00",
                              }}
                            >
                              {item.price.toLocaleString()} FCFA
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#999" }}>
                              {item.stock > 0
                                ? `${item.stock} en stock`
                                : "Rupture de stock"}
                            </div>
                          </div>

                          {/* Contrôles de quantité */}
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
                                onClick={() => handleQuantityChange(item._id, -1)}
                                disabled={item.quantity <= 1}
                                style={{
                                  padding: "0.5rem 0.75rem",
                                  background: "white",
                                  border: "none",
                                  cursor:
                                    item.quantity <= 1 ? "not-allowed" : "pointer",
                                  color: item.quantity <= 1 ? "#ccc" : "#1A1A1A",
                                }}
                              >
                                <IconMinus size={18} />
                              </button>
                              <div
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontSize: "1rem",
                                  fontWeight: "700",
                                  borderLeft: "2px solid #E0E0E0",
                                  borderRight: "2px solid #E0E0E0",
                                }}
                              >
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item._id, 1)}
                                disabled={item.quantity >= item.stock}
                                style={{
                                  padding: "0.5rem 0.75rem",
                                  background: "white",
                                  border: "none",
                                  cursor:
                                    item.quantity >= item.stock
                                      ? "not-allowed"
                                      : "pointer",
                                  color:
                                    item.quantity >= item.stock ? "#ccc" : "#1A1A1A",
                                }}
                              >
                                <IconPlus size={18} />
                              </button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item._id)}
                              style={{
                                padding: "0.75rem",
                                background: "#FEE",
                                color: "#C33",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <IconTrash size={20} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Résumé de commande */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "1.5rem",
                  }}
                >
                  Résumé de commande
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      fontSize: "1rem",
                      color: "#666",
                    }}
                  >
                    <span>Sous-total ({calculateTotalItems()} articles)</span>
                    <span style={{ fontWeight: "600" }}>
                      {calculateTotal().toLocaleString()} FCFA
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      fontSize: "1rem",
                      color: "#666",
                    }}
                  >
                    <span>Livraison</span>
                    <span style={{ fontWeight: "600", color: "#4CAF50" }}>
                      {calculateTotal() >= 50000 ? "Gratuite" : "5 000 FCFA"}
                    </span>
                  </div>

                  {calculateTotal() < 50000 && (
                    <div
                      style={{
                        padding: "0.75rem",
                        background: "#FFF3E0",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "#FF7F00",
                        marginTop: "1rem",
                      }}
                    >
                      💡 Plus que{" "}
                      {(50000 - calculateTotal()).toLocaleString()} FCFA pour la
                      livraison gratuite !
                    </div>
                  )}
                </div>

                <div
                  style={{
                    borderTop: "2px solid #E0E0E0",
                    paddingTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#1A1A1A",
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#FF7F00" }}>
                      {(
                        calculateTotal() +
                        (calculateTotal() < 50000 ? 5000 : 0)
                      ).toLocaleString()}{" "}
                      FCFA
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    padding: "1.1rem",
                    background: "#FF7F00",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    boxShadow: "0 4px 16px rgba(255,127,0,0.3)",
                    
                  }}
                >
                  <IconShoppingCart size={24} />
                  Procéder au paiement
                </motion.button>

                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    background: "#F5F5F5",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    color: "#666",
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    ✓ Paiement sécurisé
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    ✓ Livraison sous 2-5 jours
                  </div>
                  <div>✓ Retour sous 14 jours</div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>
        {`
          @media (max-width: 1024px) {
            div[style*="gridTemplateColumns: 1fr 400px"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </>
  );
}