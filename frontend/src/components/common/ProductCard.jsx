import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

import { getImageUrl } from '../../services/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -15 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="group relative flex flex-col"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-primary/5 border border-white/10 shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group-hover:border-accent/40">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.nom}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        
        {/* Wishlist Action */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-6 right-6 w-12 h-12 rounded-2xl glass border border-white/20 flex items-center justify-center transition-all duration-500 hover:scale-110 z-10 ${
            inWishlist ? 'text-rose-500 shadow-lg shadow-rose-500/20' : 'text-primary dark:text-white hover:text-accent'
          }`}
        >
          <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Quick View Button - Modern SaaS Style */}
        <div className="absolute inset-x-8 bottom-8 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full py-5 bg-white text-primary font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:bg-accent hover:text-white transition-all active:scale-95"
          >
            <ShoppingBag size={16} /> Instant Cart
          </button>
        </div>
      </div>

      {/* Editorial Product Info */}
      <div className="mt-8 px-4 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Link to={`/product/${product.id}`} className="block min-w-0">
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2">
              {product.categorie_nom || 'Essentiel'}
            </p>
            <h3 className="text-xl font-black text-primary dark:text-white leading-none uppercase tracking-[-0.02em] group-hover:text-accent transition-colors truncate">
              {product.nom}
            </h3>
          </Link>
          <div className="flex flex-col items-end">
             <span className="text-lg font-black text-primary dark:text-white tracking-tighter">
              {product.prix} <span className="text-xs ml-1 text-primary/40 dark:text-white/40">MAD</span>
            </span>
          </div>
        </div>
        
        {/* Subtle hover detail */}
        <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-accent to-transparent transition-all duration-700" />
      </div>
    </motion.div>
  );
};

export default ProductCard;
