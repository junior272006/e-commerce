// utils/cartUtils.ts
// Créer ce fichier dans src/utils/

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

interface CartItem extends Product {
  quantity: number;
}

export const addToCart = (product: Product, quantity: number = 1): boolean => {
  try {
    // Récupérer le panier actuel
    const cartData = localStorage.getItem("cart");
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];

    // Vérifier si le produit existe déjà
    const existingItemIndex = cart.findIndex((item) => item._id === product._id);

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        cart[existingItemIndex].quantity = newQuantity;
      } else {
        alert(`Stock insuffisant ! Maximum: ${product.stock}`);
        return false;
      }
    } else {
      // Ajouter le nouveau produit
      cart.push({ ...product, quantity });
    }

    // Sauvegarder dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return false;
  }
};

export const getCartItemsCount = (): number => {
  try {
    const cartData = localStorage.getItem("cart");
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error("Erreur lors du comptage du panier:", error);
    return 0;
  }
};

export const getCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return [];
  }
};