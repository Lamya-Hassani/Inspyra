import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, MapPin, User, Package } from 'lucide-react';
import { statusMap } from './orderHelpers';

const OrderDetailModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-4xl rounded-xl p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-50 p-2 rounded-lg text-[#274d00]"><ShoppingBag size={24} /></div>
              <h3 className="text-2xl font-bold text-gray-900">Commande #ORD-{order.id}</h3>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
              Passée le {order.date.split('T')[0]} • Statut: <span className="text-[#274d00]">{statusMap[order.statut]}</span>
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total payé</p>
            <p className="text-3xl font-bold text-[#274d00]">{order.total} DH</p>
            {order.paiement && (
              <div className="flex flex-col items-end gap-1 mt-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                  order.paiement.statut === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  order.paiement.statut === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {order.paiement.statut}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Méthode: {order.paiement.methode}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2"><User size={16} /> Client</h4>
            <div className="p-6 bg-white rounded-xl border border-gray-100 space-y-3">
              <p className="text-lg font-bold text-gray-900">{order.utilisateur_username}</p>
              <p className="text-sm font-bold text-gray-500 lowercase first-letter:uppercase">{order.utilisateur_username}@client.ma</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 font-bold uppercase"><MapPin size={12} /> Casablanca, Maroc</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2"><Package size={16} /> Articles</h4>
            <div className="space-y-3">
              {order.lignes?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Variété #{item.plante}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.quantite} unité(s) • {item.prix} DH/u</p>
                  </div>
                  <p className="text-sm font-bold text-[#274d00]">{item.prix * item.quantite} DH</p>
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
