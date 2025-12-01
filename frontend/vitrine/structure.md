┌─────────────────────────────────────────────────────────────────────────────┐
│                        STRUCTURE PROJET E-COMMERCE                          │
│                     Backend (Express) + Frontend (React)                    │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
📁 BACKEND
═══════════════════════════════════════════════════════════════════════════════

backend/
 ├─ config/
 │   ├─ db.js                    🔧 Connexion à MongoDB
 │   └─ env.js                   🔧 Configuration des variables d'environnement
 │
 ├─ models/                      📊 SCHÉMAS DE DONNÉES (Structure MongoDB)
 │   ├─ User.js                  └─> Définit: email, password, role, adresses
 │   ├─ Product.js               └─> Définit: name, price, category, stock, images
 │   ├─ Cart.js                  └─> Définit: userId, items[], totalPrice
 │   └─ Order.js                 └─> Définit: userId, items[], status, total
 │
 ├─ controllers/                 🧠 LOGIQUE MÉTIER (Traitement des données)
 │   ├─ authController.js        └─> register(), login(), getProfile()
 │   ├─ productController.js     └─> getAllProducts(), getProductById(), createProduct()
 │   ├─ cartController.js        └─> getCart(), addToCart(), removeFromCart()
 │   ├─ orderController.js       └─> createOrder(), getOrders(), updateOrderStatus()
 │   └─ adminController.js       └─> adminStats(), manageProducts(), manageOrders()
 │
 ├─ routes/                      🛣️ URLS DE L'API (Définit les endpoints)
 │   ├─ auth.js                  └─> POST /api/auth/register, /login
 │   ├─ products.js              └─> GET /api/products, POST /api/products
 │   ├─ cart.js                  └─> GET /api/cart, POST /api/cart/add
 │   ├─ order.js                 └─> POST /api/orders, GET /api/orders
 │   └─ admin.js                 └─> GET /api/admin/stats, PUT /api/admin/products/:id
 │
 ├─ middleware/                  🚦 VÉRIFICATIONS (Exécuté AVANT le controller)
 │   ├─ auth.js                  └─> Vérifie si utilisateur connecté (JWT)
 │   ├─ admin.js                 └─> Vérifie si utilisateur est admin
 │   ├─ errorHandler.js          └─> Gère les erreurs de manière centralisée
 │   └─ upload.js                └─> Gère l'upload d'images (Multer)
 │
 ├─ utils/                       🔨 FONCTIONS UTILITAIRES
 │   ├─ generateToken.js         └─> Crée un token JWT
 │   └─ validators.js            └─> Valide les données (email, password, etc.)
 │
 ├─ uploads/                     📸 Images téléchargées
 ├─ server.js                    🚀 Point d'entrée du serveur
 ├─ .env                         🔐 Variables secrètes (MONGO_URI, JWT_SECRET)
 ├─ .gitignore                   🚫 Fichiers à ne pas commit
 └─ package.json                 📦 Dépendances backend


═══════════════════════════════════════════════════════════════════════════════
📁 FRONTEND
═══════════════════════════════════════════════════════════════════════════════

frontend/
 ├─ public/
 │   └─ index.html
 │
 ├─ src/
 │   │
 │   ├─ api/                     🌐 SERVICES API (Communication avec backend)
 │   │   ├─ axiosConfig.js       └─> Configuration axios (baseURL, headers)
 │   │   ├─ authService.js       └─> registerUser(), loginUser(), logoutUser()
 │   │   ├─ productService.js    └─> getProducts(), getProductById(), searchProducts()
 │   │   ├─ cartService.js       └─> addToCart(), removeFromCart(), getCart()
 │   │   └─ orderService.js      └─> createOrder(), getOrders(), getOrderById()
 │   │
 │   ├─ components/              🧩 COMPOSANTS RÉUTILISABLES
 │   │   │
 │   │   ├─ common/              └─> Composants partagés partout
 │   │   │   ├─ Header.jsx       └──> Logo, menu, panier (en haut de page)
 │   │   │   ├─ Footer.jsx       └──> Liens, copyright (en bas de page)
 │   │   │   ├─ Navbar.jsx       └──> Navigation principale
 │   │   │   └─ LoadingSpinner.jsx └─> Icône de chargement
 │   │   │
 │   │   ├─ product/             └─> Composants liés aux produits
 │   │   │   ├─ ProductCard.jsx  └──> Affiche UN produit (image, nom, prix)
 │   │   │   ├─ ProductGrid.jsx  └──> Grille de ProductCards
 │   │   │   ├─ ProductDetail.jsx └─> Détails complets d'un produit
 │   │   │   └─ ProductFilters.jsx └> Filtres (catégorie, prix, marque)
 │   │   │
 │   │   ├─ cart/                └─> Composants du panier
 │   │   │   ├─ CartItem.jsx     └──> UN article dans le panier
 │   │   │   ├─ CartSummary.jsx  └──> Résumé total du panier
 │   │   │   └─ CartDrawer.jsx   └──> Panier qui s'ouvre sur le côté
 │   │   │
 │   │   └─ admin/               └─> Composants pour l'admin
 │   │       ├─ ProductForm.jsx  └──> Formulaire créer/modifier produit
 │   │       ├─ ProductTable.jsx └──> Tableau de tous les produits
 │   │       └─ OrderManagement.jsx └> Gestion des commandes
 │   │
 │   ├─ pages/                   📄 PAGES COMPLÈTES (Écrans de l'app)
 │   │   ├─ Home.jsx             └─> Page d'accueil (hero, produits vedettes)
 │   │   ├─ Shop.jsx             └─> Catalogue complet avec filtres
 │   │   ├─ ProductPage.jsx      └─> Page détail d'un produit
 │   │   ├─ Cart.jsx             └─> Page panier
 │   │   ├─ Checkout.jsx         └─> Page paiement/commande
 │   │   ├─ Login.jsx            └─> Page connexion
 │   │   ├─ Register.jsx         └─> Page inscription
 │   │   ├─ Profile.jsx          └─> Profil utilisateur
 │   │   ├─ Orders.jsx           └─> Historique des commandes
 │   │   │
 │   │   └─ admin/               └─> Pages admin (protégées)
 │   │       ├─ Dashboard.jsx    └──> Statistiques ventes
 │   │       ├─ Products.jsx     └──> Gestion des produits
 │   │       └─ OrdersList.jsx   └──> Liste toutes les commandes
 │   │
 │   ├─ context/                 🌍 CONTEXT API (Données partagées PARTOUT)
 │   │   ├─ AuthContext.jsx      └─> user, isAuthenticated, login(), logout()
 │   │   └─ CartContext.jsx      └─> cart, addItem(), removeItem(), total
 │   │
 │   ├─ hooks/                   🪝 CUSTOM HOOKS (Fonctions React réutilisables)
 │   │   ├─ useAuth.js           └─> Facilite l'accès au AuthContext
 │   │   ├─ useCart.js           └─> Facilite l'accès au CartContext
 │   │   └─ useProducts.js       └─> Récupère et gère les produits
 │   │
 │   ├─ utils/                   🔧 FONCTIONS UTILITAIRES (Non React)
 │   │   ├─ formatters.js        └─> formatPrice(), formatDate()
 │   │   └─ validators.js        └─> validateEmail(), validatePassword()
 │   │
 │   ├─ routes/                  🛣️ GESTION DES ROUTES
 │   │   ├─ AppRoutes.jsx        └─> Définit toutes les routes de l'app
 │   │   └─ PrivateRoute.jsx     └─> Protège les routes (connecté uniquement)
 │   │
 │   ├─ App.jsx                  🏠 Composant principal
 │   └─ main.jsx                 🚀 Point d'entrée React
 │
 ├─ .gitignore
 ├─ package.json
 ├─ vite.config.js
 └─ index.html


═══════════════════════════════════════════════════════════════════════════════
🔍 EXPLICATIONS DÉTAILLÉES DES DOSSIERS IMPORTANTS
═══════════════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────────────────┐
│ 🌍 CONTEXT - Partage de données GLOBALES                                 │
└───────────────────────────────────────────────────────────────────────────┘

PROBLÈME SANS CONTEXT :
┌─────────────┐
│   App       │ user = "John"
└──────┬──────┘
       │
   ┌───┴───┐
   │ Header│ ❌ Comment récupérer user ?
   └───────┘
       │
   ┌───┴────┐
   │ Profile│ ❌ Comment récupérer user ?
   └────────┘

SOLUTION AVEC CONTEXT :
┌──────────────────────────────────────────┐
│  AuthContext (user = "John")             │ ← Stocke user ICI
│  ├─ App                                  │
│  ├─ Header     ✅ useAuth() → user       │
│  ├─ Profile    ✅ useAuth() → user       │
│  └─ Cart       ✅ useAuth() → user       │
└──────────────────────────────────────────┘

EXEMPLE AUTHCONTEXT.JSX :

// context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', userData.token);
  };

  // Fonction logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Valeurs partagées partout
  const value = {
    user,           // ← Données utilisateur
    isAuthenticated,
    login,          // ← Fonctions
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

UTILISATION DANS APP.JSX :

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>  {/* ← Enveloppe tout */}
      <Header />
      <Shop />
      <Footer />
    </AuthProvider>
  );
}

UTILISATION DANS N'IMPORTE QUEL COMPOSANT :

// pages/Profile.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div>
      <h1>Bienvenue {user.name}</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}


┌───────────────────────────────────────────────────────────────────────────┐
│ 🪝 HOOKS - Fonctions React personnalisées RÉUTILISABLES                  │
└───────────────────────────────────────────────────────────────────────────┘

POURQUOI LES HOOKS ?
Pour éviter de répéter le même code dans plusieurs composants.

EXEMPLE SANS HOOK (Code répété) :

// Profile.jsx
const { user, logout } = useContext(AuthContext); ← Répété

// Header.jsx
const { user, logout } = useContext(AuthContext); ← Répété

// Cart.jsx
const { user, logout } = useContext(AuthContext); ← Répété


SOLUTION AVEC HOOK :

// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  
  return context; // Retourne { user, login, logout, isAuthenticated }
}

UTILISATION SIMPLIFIÉE :

// Profile.jsx
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user, logout } = useAuth(); // ← Simple et propre !
  
  return <div>Bienvenue {user.name}</div>;
}

// Header.jsx
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { user } = useAuth(); // ← Simple et propre !
  
  return <div>{user ? user.name : 'Invité'}</div>;
}


AUTRE EXEMPLE - useProducts :

// hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProducts } from '../api/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return { products, loading, error };
}

UTILISATION :

// pages/Shop.jsx
import { useProducts } from '../hooks/useProducts';

function Shop() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


┌───────────────────────────────────────────────────────────────────────────┐
│ 📊 RÉCAPITULATIF - Différences clés                                      │
└───────────────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────────────┬────────────────────────────────────┐
│ Dossier      │ Rôle                │ Exemple                            │
├──────────────┼─────────────────────┼────────────────────────────────────┤
│ api/         │ Fonctions fetch     │ registerUser(), getProducts()      │
│ components/  │ Morceaux UI         │ ProductCard, Header, Footer        │
│ pages/       │ Écrans complets     │ Home, Shop, Login                  │
│ context/     │ Données partagées   │ user, cart (accessible partout)    │
│ hooks/       │ Fonctions React     │ useAuth(), useCart()               │
│ utils/       │ Helpers génériques  │ formatPrice(), validateEmail()     │
│ routes/      │ Gestion URLs        │ /home, /shop, /login               │
└──────────────┴─────────────────────┴────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│ 💡 FLUX COMPLET D'UNE ACTION (Exemple: Ajouter au panier)                │
└───────────────────────────────────────────────────────────────────────────┘

1. Utilisateur clique sur "Ajouter au panier" dans ProductCard.jsx
              ↓
2. ProductCard appelle addToCart() du CartContext
              ↓
3. CartContext appelle addToCart() du cartService.js (API)
              ↓
4. cartService fait fetch() vers backend : POST /api/cart/add
              ↓
5. Backend (routes/cart.js) reçoit la requête
              ↓
6. Middleware auth.js vérifie si utilisateur connecté
              ↓
7. cartController.js ajoute le produit au panier MongoDB
              ↓
8. Backend renvoie le panier mis à jour
              ↓
9. CartContext met à jour le state
              ↓
10. TOUS les composants utilisant useCart() voient le panier mis à jour !
    (Header badge panier, CartDrawer, Cart page, etc.)


┌───────────────────────────────────────────────────────────────────────────┐
│ ✅ BONNES PRATIQUES                                                       │
└───────────────────────────────────────────────────────────────────────────┘

✅ Utilisez Context pour: user, cart, theme, language
✅ Créez des hooks custom pour: logique réutilisable
✅ Mettez les appels API dans api/
✅ Gardez les components simples et réutilisables
✅ Une page = un fichier dans pages/
✅ Utils = fonctions non-React (formatage, calculs, etc.)