import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, MapPin, User, Package } from 'lucide-react';
import { statusMap } from './orderHelpers';

const OrderDetailModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass w-full max-w-4xl rounded-[4rem] p-12 relative animate-float shadow-2xl border border-white/20">
        <button onClick={onClose} className="absolute top-10 right-10 p-3 hover:bg-white/20 rounded-2xl transition-all"><X /></button>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500"><ShoppingBag size={24} /></div>
              <h3 className="text-3xl font-black text-emerald-900 dark:text-white tracking-tighter uppercase">Commande ORD-{order.id}</h3>
            </div>
            <p className="text-emerald-950 dark:text-white/40 dark:text-emerald-50/40 font-bold uppercase tracking-widest text-[10px] pl-11">
              Passee le {order.date.split('T')[0]} • Status: <span className="text-emerald-600">{statusMap[order.statut]}</span>
            </p>
          </div>
          <div className="text-right glass p-6 rounded-[2rem] border border-emerald-500/10">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total paye</p>
            <p className="text-4xl font-black text-emerald-900 dark:text-white mb-2">{order.total} DH</p>
            {order.paiement && (
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  order.paiement.statut === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
                  order.paiement.statut === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-rose-500/10 text-rose-600'
                }`}>
                  Paiement: {order.paiement.statut}
                </span>
                <span className="text-[10px] font-bold text-emerald-950 dark:text-white/40 dark:text-emerald-50/40 uppercase tracking-wider">
                  Via: {order.paiement.methode}
                </span>
              </div>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[.3em] flex items-center gap-2"><User size={14} /> Informations Client</h4>
            <div className="glass p-8 rounded-[2.5rem] space-y-4 border border-white/10">
              <p className="text-xl font-black text-emerald-950 dark:text-white">{order.utilisateur_username}</p>
              <p className="text-lg font-bold text-emerald-600">{order.utilisateur_username.toLowerCase()}@inspyra-client.ma</p>
              <p className="text-sm font-medium opacity-60 italic flex items-center gap-1"><MapPin size={10} /> Secteur 22, Casablanca, Maroc</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[.3em] flex items-center gap-2"><Package size={14} /> Contenu du Panier</h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {order.lignes?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-emerald-500/5 p-4 rounded-3xl border border-white/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-emerald-950 dark:text-white truncate uppercase tracking-tighter">Variete #{item.plante}</p>
                    <p className="text-[10px] font-bold text-emerald-500 tracking-widest">{item.quantite} unite(s) • {item.prix} DH/u</p>
                  </div>
                  <p className="text-sm font-black text-emerald-900 dark:text-white">{item.prix * item.quantite} DH</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailModal;
