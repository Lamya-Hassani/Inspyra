import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl } from '../../services/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.nom}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Action */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-gray-100 flex items-center justify-center transition-all hover:scale-110 z-10 ${
            inWishlist ? 'text-red-500 shadow-sm' : 'text-gray-400 hover:text-[#92B061]'
          }`}
        >
          <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Add to Cart Button */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full py-3 bg-[#274d00] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-[#1e3b00] transition-colors"
          >
            <ShoppingBag size={16} /> Ajouter au panier
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#92B061]">
          {product.categorie_nom || 'Essentiel'}
        </p>
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#274d00] transition-colors truncate">
              {product.nom}
            </h3>
          </Link>
          <span className="text-lg font-bold text-[#274d00] whitespace-nowrap">
            {product.prix} MAD
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
