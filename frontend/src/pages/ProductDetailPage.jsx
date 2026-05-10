import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Droplets, Sun, Thermometer, ShieldCheck, ArrowLeft, Plus, Minus, Share2, Leaf } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#92B061] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-3xl font-bold text-[#274d00]">Plante introuvable</h2>
      <Link to="/shop" className="mt-6 px-8 py-3 bg-[#274d00] text-white font-bold rounded-lg">Retour à la boutique</Link>
    </div>
  );

  const careInfo = [
    { icon: Droplets, label: "Arrosage", value: product.besoinEau || "Normal" },
    { icon: Sun, label: "Lumière", value: product.besoinLumiere || "Indirecte" },
    { icon: Thermometer, label: "Température", value: `${product.temperatureMin || 18}°C - ${product.temperatureMax || 25}°C` },
    { icon: ShieldCheck, label: "Difficulté", value: product.niveauEntretien || "Débutant" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-5 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                <img src={getImageUrl(product.image)} alt="view" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#92B061]">{product.categorie_details?.nom || 'Plante'}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleWishlist(product.id)} className={`p-3 rounded-lg border transition-colors ${isInWishlist(product.id) ? 'text-red-500 bg-red-50 border-red-100' : 'text-gray-400 bg-white border-gray-100 hover:bg-gray-50'}`}>
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Lien copié !');
                  }}
                  className="p-3 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#274d00] leading-tight">
              {product.nom}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold text-[#274d00]">{product.prix} MAD</p>
              <div className="h-4 w-px bg-gray-200"></div>
              <p className="text-sm text-gray-400 italic font-medium">{product.nomScientifique}</p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "Une magnifique plante pour votre intérieur. Facile d'entretien et très décorative."}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {careInfo.map((info, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg text-[#92B061]">
                  <info.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{info.label}</p>
                  <p className="text-sm font-bold text-gray-700">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-6">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <button 
              onClick={() => {
                addToCart({...product, quantity});
                toast.success('Ajouté au panier !');
              }}
              className="flex-1 bg-[#274d00] text-white font-bold py-4 rounded-lg hover:bg-[#1e3b00] flex items-center justify-center gap-3 transition-colors shadow-lg"
            >
              <ShoppingBag size={20} /> Ajouter au panier
            </button>
          </div>

          <div className="pt-8 border-t border-gray-100 flex gap-8">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={18} className="text-[#92B061]" /> Garantie 30 jours
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <Leaf size={18} className="text-[#92B061]" /> Livraison soignée
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
