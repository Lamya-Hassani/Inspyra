import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Droplets, Sun, Thermometer, ShieldCheck, ArrowLeft, Plus, Minus, Share2, Sparkles, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getPlant(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <div className="w-24 h-24 border-t-2 border-accent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.5em]">Immersion Botanique...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter">Éden Introuvable</h2>
      <Link to="/shop" className="mt-8 px-10 py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-full">Retourner à la boutique</Link>
    </div>
  );

  const careInfo = [
    { icon: Droplets, label: "Hydratation", value: product.besoinEau || "Régulier" },
    { icon: Sun, label: "Exposition", value: product.besoinLumiere || "Modérée" },
    { icon: Thermometer, label: "Climat", value: `${product.temperatureMin || 18}°C - ${product.temperatureMax || 25}°C` },
    { icon: ShieldCheck, label: "Expertise", value: product.niveauEntretien || "Facile" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-32 pt-8">
      <Link to="/shop" className="inline-flex items-center gap-4 text-[10px] font-black uppercase text-primary/30 dark:text-white/30 hover:text-accent transition-all mb-12 group tracking-widest">
        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Retour à la bibliothèque
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left: Cinematic Gallery */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[4rem] overflow-hidden glass border border-white/10 shadow-3xl relative group ring-1 ring-white/5"
          >
            <img 
              src={getImageUrl(product.image)} 
              alt={product.nom}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-10 left-10 inline-flex items-center gap-3 px-6 py-3 glass rounded-2xl border border-white/20 backdrop-blur-2xl shadow-2xl">
              <Sparkles size={16} className="text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary dark:text-white leading-none">Spécimen Rare</span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-[1.5rem] overflow-hidden glass border border-white/10 cursor-pointer hover:border-accent/50 transition-all opacity-40 hover:opacity-100 hover:scale-105">
                <img 
                   src={getImageUrl(product.image)} 
                   className="w-full h-full object-cover" alt="view" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editorial Info */}
        <div className="space-y-12 lg:sticky lg:top-32">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">{product.categorie_details?.nom || 'Collection Privée'}</span>
              <div className="flex items-center gap-4">
                 <button onClick={() => toggleWishlist(product.id)} className={`w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center transition-all ${isInWishlist(product.id) ? 'text-rose-500 shadow-lg shadow-rose-500/20' : 'text-primary/40 dark:text-white/40 hover:text-accent'}`}>
                    <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                 </button>
                 <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Lien copié dans le presse-papiers !', {
                        style: { background: '#274D00', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                      });
                    }}
                    className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-primary/40 dark:text-white/40 hover:text-accent transition-all"
                 >
                    <Share2 size={20} />
                 </button>
              </div>
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-none">
              {product.nom}
            </h1>
            <div className="flex items-center gap-4">
               <p className="text-sm font-black text-accent italic uppercase tracking-widest">{product.nomScientifique}</p>
               <div className="h-px w-12 bg-primary/10"></div>
               <p className="text-2xl font-black text-primary dark:text-white tracking-tighter">{product.prix} <span className="text-xs text-primary/40 dark:text-white/40 ml-1">MAD</span></p>
            </div>
          </div>

          <div className="space-y-10">
            <p className="text-lg text-primary/60 dark:text-white/60 font-medium leading-relaxed italic lowercase first-letter:uppercase">
              {product.description || "Un spécimen d'exception qui redéfinit l'espace. Son architecture organique et sa robustesse en font une pièce maîtresse de toute collection botanique."}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {careInfo.map((info, idx) => (
                <div key={idx} className="p-6 glass rounded-3xl border border-white/5 flex items-center gap-5 group hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <info.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-primary/20 dark:text-white/20 tracking-[0.2em] mb-1">{info.label}</p>
                    <p className="text-sm font-black text-primary dark:text-white uppercase tracking-tight">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
            <div className="flex items-center gap-2 glass p-2 rounded-[2rem] border border-white/10 w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 rounded-[1.5rem] bg-white dark:bg-primary/20 flex items-center justify-center shadow-lg text-primary hover:bg-accent hover:text-white transition-all transform active:scale-90"
              >
                <Minus size={20} />
              </button>
              <span className="w-16 text-center text-2xl font-black text-primary dark:text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 rounded-[1.5rem] bg-white dark:bg-primary/20 flex items-center justify-center shadow-lg text-primary hover:bg-accent hover:text-white transition-all transform active:scale-90"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <button 
              onClick={() => {
                addToCart({...product, quantity});
                toast.success('Ajouté à la collection', {
                  icon: '🌿',
                  style: { borderRadius: '20px', background: '#274D00', color: '#fff', fontWeight: 'bold' }
                });
              }}
              className="flex-grow w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-3xl shadow-primary/30 transition-all hover:bg-accent hover:-translate-y-2 active:scale-95"
            >
              <ShoppingBag size={20} /> Déposer au panier
            </button>
          </div>

          <div className="pt-12 border-t border-primary/5 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-accent" size={20} />
              <span className="text-[9px] font-black uppercase text-primary/30 dark:text-white/30 tracking-widest">Soin Garanti 30J</span>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="text-accent" size={20} />
              <span className="text-[9px] font-black uppercase text-primary/30 dark:text-white/30 tracking-widest">Expédition Organique</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
