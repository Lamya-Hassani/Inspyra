import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-forest/40 backdrop-blur-[12px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-premium border-l border-white/10 shadow-3xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-primary dark:text-white uppercase tracking-tighter">Votre Éden</h2>
                  <p className="text-[9px] font-black uppercase text-accent tracking-[0.3em]">{cartItems.length} Spécimens</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all group"
              >
                <X size={20} className="text-primary/40 dark:text-white/40 group-hover:text-primary dark:group-hover:text-white" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-10">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-32 h-32 rounded-full glass border border-white/10 flex items-center justify-center">
                    <ShoppingBag size={48} className="text-primary/10" />
                  </div>
                  <div className="space-y-4">
                    <p className="font-black text-primary/40 dark:text-white/40 uppercase tracking-[0.4em] text-[10px]">La corbeille est vide</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-10 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-2xl"
                    >
                      Explorer l'Eden
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout
                    key={item.id || item.planteId}
                    className="flex gap-6 group"
                  >
                    <div className="w-28 h-32 rounded-[2rem] bg-primary/5 overflow-hidden border border-white/10 shrink-0 relative">
                      <img 
                        src={getImageUrl(item.image) || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&h=300&auto=format&fit=crop'} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-black text-primary dark:text-white leading-none uppercase tracking-[-0.02em] text-base">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.planteId)}
                            className="text-rose-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-accent font-black text-sm tracking-tighter">{item.price} MAD</p>
                      </div>
                      
                      <div className="flex items-center gap-2 glass p-1.5 rounded-2xl border border-white/10 self-start">
                        <button 
                          onClick={() => updateQuantity(item.planteId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-primary/20 flex items-center justify-center shadow-sm text-primary hover:bg-accent hover:text-white transition-all transform active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-black text-primary dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.planteId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-primary/20 flex items-center justify-center shadow-sm text-primary hover:bg-accent hover:text-white transition-all transform active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 glass border-t border-white/10 bg-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase text-primary/30 dark:text-white/30 tracking-[0.3em] mb-1">Total de l'immersion</p>
                    <span className="text-2xl font-black text-primary dark:text-white tracking-tighter">{cartTotal.toFixed(2)} MAD</span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-5 bg-[#274D00] hover:bg-[#6D58C7] text-white rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-2xl transition-all uppercase tracking-[0.2em] text-[10px]"
                >
                  Commander ma Collection <ArrowRight size={18} />
                </Link>
                
                <p className="text-[8px] font-bold text-primary/30 dark:text-white/30 uppercase tracking-widest text-center">
                  Livraison éco-responsable certifiée Inspyra.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
