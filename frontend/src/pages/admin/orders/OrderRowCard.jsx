import React from 'react';
import { Package, User, Eye } from 'lucide-react';
import { getStatusIcon } from './orderHelpers';

const OrderRowCard = ({ order, onStatusChange, onOpenDetail }) => {
  const statusVisual = getStatusIcon(order.statut);
  const StatusIcon = statusVisual.icon;

  return (
    <div className="glass group hover:scale-[1.01] transition-all duration-300 border border-white/10">
      <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shrink-0"><Package className="text-emerald-500" size={32} /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-black text-emerald-900 dark:text-white uppercase tracking-tighter">#ORD-{order.id}</h3>
              <div className="flex items-center gap-2">
                <StatusIcon size={14} className={statusVisual.className} />
                <select value={order.statut} onChange={(e) => onStatusChange(order.id, e.target.value)} className={`bg-white/30 dark:bg-emerald-900/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-white/10 cursor-pointer ${order.statut === 'DELIVERED' ? 'text-emerald-500' : order.statut === 'CANCELLED' ? 'text-rose-500' : 'text-blue-500'}`}>
                  <option value="PENDING">Preparation</option><option value="SHIPPED">Expedie</option><option value="DELIVERED">Livre</option><option value="CANCELLED">Annule</option>
                </select>
              </div>
            </div>
            <p className="text-sm font-bold text-emerald-900/40 dark:text-emerald-100/40 flex items-center gap-2"><User size={14} className="text-emerald-500/50" /> Par <span className="text-emerald-900 dark:text-emerald-100 font-black">{order.utilisateur_username}</span> • {order.date.split('T')[0]}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-12 shrink-0">
          <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1 text-center">Total</p>
            <p className="text-2xl font-black text-emerald-900 dark:text-white tabular-nums mb-1">{order.total} DH</p>
            {order.paiement && (
               <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  order.paiement.statut === 'COMPLETED' ? 'border-emerald-500/20 text-emerald-600 bg-emerald-500/10' :
                  order.paiement.statut === 'PENDING' ? 'border-amber-500/20 text-amber-600 bg-amber-500/10' :
                  'border-rose-500/20 text-rose-600 bg-rose-500/10'
                }`}>
                 {order.paiement.methode} • {order.paiement.statut}
               </div>
            )}
          </div>

          <button onClick={onOpenDetail} className="p-4 rounded-2xl bg-white/50 dark:bg-emerald-950/20 border border-white/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-600/5"><Eye size={22} /></button>
        </div>
      </div>
    </div>
  );
};

export default OrderRowCard;
