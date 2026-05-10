import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { CreditCard, Truck, Landmark, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { cartItems, cartTotal, checkout, loading } = useCart();
  const [method, setMethod] = useState('CARD');
  const navigate = useNavigate();

  const handlePayment = async () => {
    const orderId = await checkout(method);
    if (orderId) {
      toast.success("Immersion Validée !", {
        icon: '🌿',
        style: { borderRadius: '20px', background: '#274D00', color: '#fff', fontWeight: 'bold' }
      });
      navigate('/profile');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-10 px-4">
        <div className="w-32 h-32 rounded-full glass border border-white/10 flex items-center justify-center text-primary/10">
          <Truck size={48} />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter">Votre Panier est Vierge</h2>
          <p className="text-primary/40 dark:text-white/40 font-medium italic">Commencez votre collection avant de passer à l'étape finale.</p>
        </div>
        <button onClick={() => navigate('/shop')} className="px-12 py-5 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-full shadow-3xl hover:bg-accent transition-all flex items-center gap-4">
          <ChevronLeft size={16} /> Explorer l'Éden
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-32 pt-12">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        
        {/* Left: Editorial Payment Section */}
        <div className="flex-grow space-y-16">
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-none">
              Finaliser <br/> <span className="text-accent italic">l'Immersion.</span>
            </h1>
            <p className="text-sm font-black text-primary/30 dark:text-white/30 uppercase tracking-[0.4em]">Étape 03 — Acquisition Sécurisée</p>
          </div>

          <div className="space-y-10">
            <div className="glass-premium p-10 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-10">
              <h2 className="text-xs font-black text-accent uppercase tracking-[0.5em]">Mode de Règlement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className={`relative group p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${method === 'CARD' ? 'border-primary bg-primary text-white shadow-3xl' : 'glass border-white/10 hover:border-accent/40 text-primary dark:text-white'}`}>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${method === 'CARD' ? 'bg-white text-primary' : 'bg-primary/5 text-primary'}`}>
                      <CreditCard size={28} />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-tight text-lg">Carte Bancaire</p>
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${method === 'CARD' ? 'text-black/60' : 'text-primary/30'}`}>Visa, Mastercard, AMEX</p>
                    </div>
                  </div>
                  <input type="radio" name="method" value="CARD" checked={method === 'CARD'} onChange={(e) => setMethod(e.target.value)} className="hidden" />
                  {method === 'CARD' && <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>}
                </label>

                <label className={`relative group p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${method === 'COD' ? 'border-primary bg-primary text-white shadow-3xl' : 'glass border-white/10 hover:border-accent/40 text-primary dark:text-white'}`}>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${method === 'COD' ? 'bg-white text-primary' : 'bg-primary/5 text-primary'}`}>
                      <Truck size={28} />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-tight text-lg">Paiement Livraison</p>
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${method === 'COD' ? 'text-black/60' : 'text-primary/30'}`}>Règlement à réception</p>
                    </div>
                  </div>
                  <input type="radio" name="method" value="COD" checked={method === 'COD'} onChange={(e) => setMethod(e.target.value)} className="hidden" />
                </label>
              </div>
            </div>

            <div className="glass-premium p-10 rounded-[3rem] border border-white/10 bg-primary/5 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl shrink-0">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xs font-black uppercase text-accent tracking-[0.3em]">Garantie de Sérénité</h3>
                  <p className="text-sm font-medium text-primary/60 dark:text-white/60 leading-relaxed italic">
                    Chaque acquisition est protégée par un protocole de cryptage avancé. Vos données sont éphémères, votre collection est éternelle.
                  </p>
                </div>
              </div>
              <Landmark size={180} className="absolute -bottom-16 -right-16 text-primary/5 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* Right: Summary Sidebar */}
        <aside className="w-full lg:w-[450px] space-y-10 lg:sticky lg:top-32">
          <div className="glass-premium p-10 rounded-[4rem] border border-white/10 shadow-3xl space-y-12">
            <h2 className="text-xs font-black text-accent uppercase tracking-[0.5em]">Résumé de la Collection</h2>
            
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.planteId} className="flex items-center gap-6 group">
                  <div className="w-20 h-24 rounded-2xl overflow-hidden glass border border-white/10 shrink-0">
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <p className="font-black text-primary dark:text-white uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-black text-primary dark:text-white tracking-tighter">{(item.price * item.quantity).toFixed(2)} <span className="text-[10px] ml-1">MAD</span></p>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-primary/5">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-primary/40">
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-accent">
                <span>Expédition</span>
                <span className="italic">Offerte</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-primary/5">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary dark:text-white">Total Final</span>
                <span className="text-4xl font-black text-primary dark:text-white tracking-tighter">{cartTotal.toFixed(2)} <span className="text-sm ml-1">MAD</span></span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-6 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-3xl shadow-primary/30 hover:bg-accent hover:-translate-y-2 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Valider l'Acquisition <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </div>

          <div className="px-10 flex items-center gap-4 justify-center">
            <div className="h-px bg-primary/5 flex-grow"></div>
            <p className="text-[9px] font-black uppercase text-primary/20 tracking-[0.4em]">Inspyra Secure Checkout</p>
            <div className="h-px bg-primary/5 flex-grow"></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
