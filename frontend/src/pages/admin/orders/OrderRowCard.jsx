import React from 'react';
import { Package, User, Eye } from 'lucide-react';
import { getStatusIcon } from './orderHelpers';

const OrderRowCard = ({ order, onStatusChange, onOpenDetail }) => {
  const statusVisual = getStatusIcon(order.statut);
  const StatusIcon = statusVisual.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <Package className="text-gray-400" size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-gray-900">#ORD-{order.id}</h3>
              <div className="flex items-center gap-2">
                <StatusIcon size={14} className={statusVisual.className} />
                <select 
                  value={order.statut} 
                  onChange={(e) => onStatusChange(order.id, e.target.value)} 
                  className={`bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-gray-100 cursor-pointer outline-none focus:border-[#92B061] ${
                    order.statut === 'DELIVERED' ? 'text-green-600' : 
                    order.statut === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  <option value="PENDING">Préparation</option>
                  <option value="SHIPPED">Expédié</option>
                  <option value="DELIVERED">Livré</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase">
              <User size={12} /> {order.utilisateur_username} • {order.date.split('T')[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 lg:gap-12 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
          <div className="text-left lg:text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900">{order.total} DH</p>
            {order.paiement && (
               <div className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border mt-1 inline-block ${
                  order.paiement.statut === 'COMPLETED' ? 'border-green-100 text-green-600 bg-green-50' :
                  order.paiement.statut === 'PENDING' ? 'border-amber-100 text-amber-600 bg-amber-50' :
                  'border-red-100 text-red-600 bg-red-50'
                }`}>
                 {order.paiement.methode} • {order.paiement.statut}
               </div>
            )}
          </div>

          <button 
            onClick={onOpenDetail} 
            className="p-3 rounded-lg border border-gray-100 text-gray-400 hover:bg-[#274d00] hover:text-white hover:border-[#274d00] transition-colors"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderRowCard;
