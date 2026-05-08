import React, { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, Download, FileText, AlertCircle } from 'lucide-react';
import API from '../../../services/api';
import OrderRowCard from './OrderRowCard';
import OrderDetailModal from './OrderDetailModal';
import { exportOrdersCsv, statusMap } from './orderHelpers';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('orders/');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch = order.utilisateur_username.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || order.statut === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchTerm, statusFilter]
  );

  const handleStatusUpdate = async (id, newStatus) => {
    await API.patch(`orders/${id}/`, { statut: newStatus });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, statut: newStatus } : o)));
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-emerald-900 dark:text-white tracking-tight">Suivi des <span className="text-gradient">Commandes</span></h2>
          <p className="text-emerald-800/50 dark:text-emerald-100/50 font-medium">Supervisez la logistique et la satisfaction client.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => exportOrdersCsv(filteredOrders, statusFilter)} className="glass px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-emerald-900 dark:text-white hover:bg-white/40 transition-all flex items-center gap-2 border border-white/20"><Download size={16} />Exporter CSV</button>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"><FileText size={20} />Rapports</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40" /><input type="text" placeholder="Rechercher par Client ou ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full glass pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all" /></div>
        <div className="flex gap-4"><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-emerald-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">{Object.keys(statusMap).map((key) => <option key={key} value={key}>{statusMap[key]}</option>)}</select><div className="glass px-6 py-4 rounded-[1.5rem] flex items-center gap-3 font-bold text-emerald-500 text-sm">{filteredOrders.length} Commandes</div></div>
      </div>

      {filteredOrders.length === 0 && <div className="glass p-20 rounded-[3rem] text-center space-y-4"><div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-500"><AlertCircle size={40} /></div><h3 className="text-2xl font-black text-emerald-900 dark:text-white">Aucune commande</h3><p className="text-emerald-800/50 dark:text-emerald-100/50 font-medium">Verifiez vos filtres de recherche.</p></div>}
      <div className="grid grid-cols-1 gap-6">{filteredOrders.map((order) => <OrderRowCard key={order.id} order={order} onStatusChange={handleStatusUpdate} onOpenDetail={() => setSelectedOrder(order)} />)}</div>
      <OrderDetailModal isOpen={Boolean(selectedOrder)} order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-600">
    <Loader2 className="w-12 h-12 animate-spin" />
    <p className="font-black uppercase tracking-widest text-sm text-center">Synchronisation des expeditions...</p>
  </div>
);

export default OrderManagementPage;
