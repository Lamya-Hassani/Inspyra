import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

// Simple cookie helpers
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const wishlistKey = user ? `wishlist_user_${user.id}` : 'wishlist_guest';

  // Load wishlist when user changes
  useEffect(() => {
    const saved = getCookie(wishlistKey);
    if (saved) {
      setWishlist(saved);
    } else {
      setWishlist([]);
    }
  }, [wishlistKey]);

  // Sync wishlist to cookie whenever it changes
  useEffect(() => {
    setCookie(wishlistKey, wishlist, 30);
  }, [wishlist, wishlistKey]);

  const toggleWishlist = (plantId) => {
    setWishlist(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId) 
        : [...prev, plantId]
    );
  };

  const isInWishlist = (plantId) => wishlist.includes(plantId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
