import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from backend or local storage
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const cart = await cartService.getCart();
        const mappedItems = cart.articles.map(art => ({
          planteId: art.plante,
          name: art.plante_details.nom,
          price: art.plante_details.prix,
          image: art.plante_details.image,
          quantity: art.quantite
        }));
        setCartItems(mappedItems);
      } catch (error) {
        console.error("Fetch cart error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('inspyra_guest_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [isAuthenticated]);

  const syncGuestCart = useCallback(async () => {
    const localItems = JSON.parse(localStorage.getItem('inspyra_guest_cart') || '[]');
    if (localItems.length > 0 && isAuthenticated) {
      for (const item of localItems) {
        await cartService.addItem(item.planteId, item.quantity);
      }
      localStorage.removeItem('inspyra_guest_cart');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated) {
        await syncGuestCart();
      }
      await fetchCart();
    };
    init();
  }, [isAuthenticated, fetchCart, syncGuestCart]);

  const addToCart = async (plant) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        await cartService.addItem(plant.id, 1);
        await fetchCart();
        toast.success(`${plant.nom} ajouté !`);
      } catch (error) {
        toast.error("Échec de l'ajout.");
      } finally {
        setLoading(false);
      }
    } else {
      const items = [...cartItems];
      const existingIdx = items.findIndex(item => item.planteId === plant.id);
      if (existingIdx > -1) {
        items[existingIdx].quantity += 1;
      } else {
        items.push({
          planteId: plant.id,
          name: plant.nom,
          price: plant.prix,
          image: plant.image,
          quantity: 1
        });
      }
      localStorage.setItem('inspyra_guest_cart', JSON.stringify(items));
      setCartItems(items);
      toast.success(`${plant.nom} ajouté !`);
    }
  };

  const updateQuantity = async (plantId, newQuantity) => {
    if (newQuantity < 1) return;
    if (isAuthenticated) {
      try {
        await cartService.updateQuantity(plantId, newQuantity);
        await fetchCart();
      } catch (error) {
        toast.error("Mise à jour impossible.");
      }
    } else {
      const items = cartItems.map(item => 
        item.planteId === plantId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('inspyra_guest_cart', JSON.stringify(items));
      setCartItems(items);
    }
  };

  const removeFromCart = async (plantId) => {
    if (isAuthenticated) {
      try {
        await cartService.removeItem(plantId);
        await fetchCart();
        toast.success("Retiré du panier.");
      } catch (error) {
        toast.error("Échec de la suppression.");
      }
    } else {
      const items = cartItems.filter(item => item.planteId !== plantId);
      localStorage.setItem('inspyra_guest_cart', JSON.stringify(items));
      setCartItems(items);
      toast.success("Retiré du panier.");
    }
  };

  const checkout = async (methode = 'CARD') => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour payer.");
      return null;
    }
    setLoading(true);
    try {
      const response = await cartService.checkout(methode);
      setCartItems([]);
      return response.commande_id;
    } catch (error) {
      toast.error("Échec du checkout.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      checkout,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
