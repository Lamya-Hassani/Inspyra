import React from 'react';
import { Package, User, Eye, Calendar, CreditCard } from 'lucide-react';
import { getStatusIcon, statusMap } from './orderHelpers';

const OrderTable = ({ orders, onStatusChange, onOpenDetail }) => (
  <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <th className="px-8 py-6">ID Commande</th>
            <th className="px-8 py-6">Client</th>
            <th className="px-8 py-6">Date</th>
            <th className="px-8 py-6">Total</th>
            <th className="px-8 py-6">Statut</th>
            <th className="px-8 py-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => {
            const statusVisual = getStatusIcon(order.statut);
            const StatusIcon = statusVisual.icon;
            return (
              <tr key={order.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                      <Package className="text-[#274d00]" size={20} />
                    </div>
                    <span className="text-sm font-black text-[#274d00]">#ORD-{order.id}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-black text-[#274d00] uppercase">
                      {order.utilisateur_username.charAt(0)}
                    </div>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{order.utilisateur_username}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{order.date.split('T')[0]}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#274d00]">{order.total} DH</span>
                    {order.paiement && (
                      <span className="text-[9px] font-black text-[#6D58C7] uppercase tracking-widest flex items-center gap-1 mt-1">
                        <CreditCard size={10} /> {order.paiement.methode}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white border border-gray-100 ${statusVisual.className}`}>
                      <StatusIcon size={14} />
                    </div>
                    <select 
                      value={order.statut} 
                      onChange={(e) => onStatusChange(order.id, e.target.value)} 
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-0 text-gray-600 hover:text-[#6D58C7] transition-colors"
                    >
                      <option value="PENDING">Préparation</option>
                      <option value="SHIPPED">Expédié</option>
                      <option value="DELIVERED">Livré</option>
                      <option value="CANCELLED">Annulé</option>
                    </select>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => onOpenDetail(order)} 
                      className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[#6D58C7] hover:border-[#6D58C7] hover:bg-purple-50 flex items-center justify-center transition-all shadow-sm"
                      title="Détails"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrderTable;
