import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Trash2, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import productService from '../services/productService';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const data = await productService.getPlants();
        const results = data.results || data;
        setProducts(results.filter(p => wishlist.includes(p.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-5 pb-20 bg-white">
      {/* Header Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-1 bg-[#6D58C7] rounded-full"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Ma Sélection</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#274d00] tracking-tight">Curation Personnelle</h1>
            <p className="text-gray-500 mt-2 font-medium italic">"Une sélection de merveilles botaniques en attente d'immersion."</p>
          </div>
          <div className="px-6 py-2 bg-purple-50 rounded-full border border-purple-100">
            <p className="text-[10px] font-black uppercase text-[#6D58C7] tracking-widest">{wishlist.length} Spécimens</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-xl shadow-gray-50 space-y-8">
           <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-300">
              <Heart size={48} />
           </div>
           <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Votre jardin est vide</h2>
              <p className="text-gray-500 font-medium italic max-w-xs mx-auto">Il est temps d'y semer vos premières envies botaniques.</p>
           </div>
           <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-4 bg-[#274d00] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#1a3400] transition-all">
              Explorer la Galerie <ArrowRight size={18} />
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {products.map((product) => (
               <motion.div 
                 key={product.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="space-y-4"
               >
                 <ProductCard product={product} />
                 <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full py-3 bg-gray-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all border border-gray-100"
                 >
                  <Trash2 size={14} /> Retirer de la liste
                 </button>
               </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Philosophy Section */}
      <div className="mt-24 p-10 md:p-16 rounded-[2.5rem] border border-gray-100 bg-green-50/30 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/20 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#274d00] shadow-xl group-hover:rotate-12 transition-transform duration-700 shrink-0 relative z-10 border border-green-50">
           <Info size={32} />
        </div>
        <div className="space-y-3 text-center md:text-left relative z-10">
           <p className="text-xl font-bold text-gray-800">Conseil d'Expert</p>
           <p className="text-gray-500 font-medium italic max-w-2xl">
              Conserver une liste d'envies est le premier pas vers un intérieur harmonieux. Prenez le temps d'étudier chaque spécimen, car une plante Inspyra est un compagnon de vie.
           </p>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
