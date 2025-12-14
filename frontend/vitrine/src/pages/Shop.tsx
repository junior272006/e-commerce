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

      <div className="cart-container">
        <div className="cart-content">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cart-header"
          >
            <div className="header-top">
              <h1 className="cart-title">
                <IconShoppingCart size={40} className="cart-icon" />
                Mon Panier
              </h1>
              <a href="#/product" className="continue-shopping">
                <IconArrowLeft size={20} />
                <span className="continue-text">Continuer mes achats</span>
              </a>
            </div>
            <p className="cart-subtitle">
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
              className="empty-cart"
            >
              <IconShoppingBag size={100} className="empty-icon" />
              <h2 className="empty-title">Votre panier est vide</h2>
              <p className="empty-text">
                Découvrez nos produits et ajoutez-les à votre panier !
              </p>
              <a href="#/product" className="shop-button">
                <IconShoppingCart size={24} />
                Voir les produits
              </a>
            </motion.div>
          ) : (
            // Panier avec articles
            <div className="cart-grid">
              {/* Liste des articles */}
              <div className="items-list">
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
                      className="cart-item"
                    >
                      {/* Image */}
                      <div className="item-image">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23f0f0f0" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Informations */}
                      <div className="item-info">
                        <div className="item-category">
                          {categoryLabels[item.category] || item.category}
                        </div>

                        <h3 className="item-title">{item.title}</h3>

                        <p className="item-description">{item.description}</p>

                        <div className="item-footer">
                          {/* Prix */}
                          <div className="item-price-section">
                            <div className="item-price">
                              {item.price.toLocaleString()} FCFA
                            </div>
                            <div className="item-stock">
                              {item.stock > 0
                                ? `${item.stock} en stock`
                                : "Rupture de stock"}
                            </div>
                          </div>

                          {/* Contrôles de quantité */}
                          <div className="item-controls">
                            <div className="quantity-controls">
                              <button
                                onClick={() => handleQuantityChange(item._id, -1)}
                                disabled={item.quantity <= 1}
                                className="quantity-button"
                              >
                                <IconMinus size={18} />
                              </button>
                              <div className="quantity-display">{item.quantity}</div>
                              <button
                                onClick={() => handleQuantityChange(item._id, 1)}
                                disabled={item.quantity >= item.stock}
                                className="quantity-button"
                              >
                                <IconPlus size={18} />
                              </button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item._id)}
                              className="delete-button"
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
                className="order-summary"
              >
                <h2 className="summary-title">Résumé de commande</h2>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Sous-total ({calculateTotalItems()} articles)</span>
                    <span className="summary-value">
                      {calculateTotal().toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Livraison</span>
                    <span className="summary-value free-shipping">
                      {calculateTotal() >= 50000 ? "Gratuite" : "5 000 FCFA"}
                    </span>
                  </div>

                  {calculateTotal() < 50000 && (
                    <div className="shipping-tip">
                      💡 Plus que{" "}
                      {(50000 - calculateTotal()).toLocaleString()} FCFA pour la
                      livraison gratuite !
                    </div>
                  )}
                </div>

                <div className="summary-total">
                  <div className="total-row">
                    <span>Total</span>
                    <span className="total-value">
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
                  className="checkout-button"
                >
                  <IconShoppingCart size={24} />
                  Procéder au paiement
                </motion.button>

                <div className="summary-info">
                  <div>✓ Paiement sécurisé</div>
                  <div>✓ Livraison sous 2-5 jours</div>
                  <div>✓ Retour sous 14 jours</div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .cart-container {
          min-height: 100vh;
          background: #FAFAFA;
          padding: 2rem 1.5rem 3rem;
          font-family: 'Work Sans', sans-serif;
        }

        .cart-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 2rem;
          margin-top: 3rem;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .cart-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-icon {
          color: #FF7F00;
        }

        .continue-shopping {
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
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .continue-shopping:hover {
          border-color: #FF7F00;
          color: #FF7F00;
        }

        .continue-text {
          white-space: nowrap;
        }

        .cart-subtitle {
          font-size: 1.1rem;
          color: #666;
        }

        .empty-cart {
          background: white;
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .empty-icon {
          color: #E0E0E0;
          margin-bottom: 2rem;
        }

        .empty-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 1rem;
        }

        .empty-text {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .shop-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: #FF7F00;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(255,127,0,0.3);
          transition: transform 0.2s ease;
        }

        .shop-button:hover {
          transform: scale(1.05);
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .item-image {
          min-width: 120px;
          width: 120px;
          height: 120px;
          background: #F5F5F5;
          border-radius: 12px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-category {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #FFF3E0;
          color: #FF7F00;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          width: fit-content;
        }

        .item-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 0.5rem;
        }

        .item-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .item-price-section {
          display: flex;
          flex-direction: column;
        }

        .item-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FF7F00;
        }

        .item-stock {
          font-size: 0.85rem;
          color: #999;
        }

        .item-controls {
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
          padding: 0.5rem 0.75rem;
          background: white;
          border: none;
          cursor: pointer;
          color: #1A1A1A;
        }

        .quantity-button:disabled {
          cursor: not-allowed;
          color: #ccc;
        }

        .quantity-display {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          font-weight: 700;
          border-left: 2px solid #E0E0E0;
          border-right: 2px solid #E0E0E0;
        }

        .delete-button {
          padding: 0.75rem;
          background: #FEE;
          color: #C33;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .order-summary {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 20px;
        }

        .summary-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 1.5rem;
        }

        .summary-details {
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          color: #666;
        }

        .summary-value {
          font-weight: 600;
        }

        .free-shipping {
          color: #4CAF50;
        }

        .shipping-tip {
          padding: 0.75rem;
          background: #FFF3E0;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #FF7F00;
          margin-top: 1rem;
        }

        .summary-total {
          border-top: 2px solid #E0E0E0;
          padding-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1A1A1A;
        }

        .total-value {
          color: #FF7F00;
        }

        .checkout-button {
          width: 100%;
          padding: 1.1rem;
          background: #FF7F00;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 16px rgba(255,127,0,0.3);
        }

        .summary-info {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #F5F5F5;
          border-radius: 12px;
          font-size: 0.85rem;
          color: #666;
        }

        .summary-info > div {
          margin-bottom: 0.5rem;
        }

        .summary-info > div:last-child {
          margin-bottom: 0;
        }

        /* Media Queries pour Mobile */
        @media (max-width: 1024px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 768px) {
          .cart-container {
            padding: 1rem 1rem 2rem;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .cart-title {
            font-size: 1.8rem;
          }

          .cart-icon {
            width: 32px;
            height: 32px;
          }

          .continue-shopping {
            width: 100%;
            justify-content: center;
            padding: 0.75rem 1rem;
          }

          .cart-subtitle {
            font-size: 1rem;
          }

          .empty-cart {
            padding: 3rem 1.5rem;
          }

          .empty-icon {
            width: 80px;
            height: 80px;
          }

          .empty-title {
            font-size: 1.5rem;
          }

          .empty-text {
            font-size: 1rem;
          }

          .cart-item {
            flex-direction: column;
            padding: 1.25rem;
            gap: 1rem;
          }

          .item-image {
            width: 100%;
            height: 200px;
            min-width: unset;
          }

          .item-title {
            font-size: 1.1rem;
          }

          .item-description {
            font-size: 0.85rem;
          }

          .item-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .item-controls {
            width: 100%;
            justify-content: space-between;
          }

          .item-price {
            font-size: 1.3rem;
          }

          .order-summary {
            padding: 1.5rem;
          }

          .summary-title {
            font-size: 1.3rem;
            margin-bottom: 1.25rem;
          }

          .summary-row {
            font-size: 0.95rem;
          }

          .shipping-tip {
            font-size: 0.8rem;
          }

          .total-row {
            font-size: 1.3rem;
          }

          .checkout-button {
            padding: 1rem;
            font-size: 1rem;
          }

          .summary-info {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .cart-title {
            font-size: 1.5rem;
            gap: 0.75rem;
          }

          .cart-icon {
            width: 28px;
            height: 28px;
          }

          .continue-shopping {
            font-size: 0.9rem;
          }

          .item-image {
            height: 180px;
          }

          .item-title {
            font-size: 1rem;
          }

          .item-price {
            font-size: 1.2rem;
          }

          .item-stock {
            font-size: 0.8rem;
          }

          .quantity-button {
            padding: 0.4rem 0.6rem;
          }

          .quantity-display {
            padding: 0.4rem 0.8rem;
            font-size: 0.95rem;
          }

          .delete-button {
            padding: 0.6rem;
          }
        }
      `}</style>
    </>
  );
}