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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-32 pt-12 space-y-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-7xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-[0.85]">
            Votre <br/> <span className="text-accent italic">Sélection.</span>
          </h1>
          <p className="text-sm font-medium text-primary/40 dark:text-white/40 max-w-sm italic">
            Une curation personnelle de merveilles botaniques en attente d'immersion.
          </p>
        </div>
        <div className="px-8 py-3 rounded-full glass border border-white/10 text-[10px] font-black uppercase text-accent tracking-[0.4em]">
          {wishlist.length} Spécimens
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-primary/5 rounded-[3.5rem] animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-premium p-32 rounded-[5rem] text-center space-y-12 shadow-3xl">
           <div className="w-24 h-24 glass border border-white/10 rounded-full flex items-center justify-center mx-auto text-primary/10">
              <Heart size={48} />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">Galerie Éphémère</h2>
              <p className="text-primary/40 dark:text-white/40 font-medium italic max-w-xs mx-auto">Votre liste est un jardin blanc. Il est temps d'y semer vos envies.</p>
           </div>
           <Link to="/shop" className="inline-flex items-center gap-4 px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-accent transition-all">
              Explorer la Galerie <ArrowRight size={18} />
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          <AnimatePresence>
            {products.map((product) => (
               <motion.div 
                 key={product.id}
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="space-y-6"
               >
                 <ProductCard product={product} />
                 <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full py-4 glass border border-rose-100/50 text-rose-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                 >
                  <Trash2 size={14} /> Libérer de la liste
                 </button>
               </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editorial Advice Section */}
      <div className="glass-premium p-12 lg:p-20 rounded-[4rem] border border-white/10 flex flex-col md:flex-row items-center gap-12 bg-primary/5 relative overflow-hidden group">
        <div className="w-24 h-24 glass border border-white/20 rounded-[2rem] flex items-center justify-center text-accent shadow-3xl group-hover:rotate-12 transition-transform duration-700 shrink-0">
           <Info size={40} />
        </div>
        <div className="space-y-4 text-center md:text-left relative z-10">
           <p className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">Philosophie de Curation</p>
           <p className="text-primary/60 dark:text-white/60 font-medium italic lowercase first-letter:uppercase max-w-2xl">
              Conserver une liste d'envies est le premier pas vers un intérieur harmonieux. Prenez le temps d'étudier chaque spécimen, car une plante Inspyra est un compagnon de vie, pas un simple décor.
           </p>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default WishlistPage;
