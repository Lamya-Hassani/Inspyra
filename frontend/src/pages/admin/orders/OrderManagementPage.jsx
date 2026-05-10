import React, { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, Download, FileText, AlertCircle } from 'lucide-react';
import API from '../../../services/api';
import OrderTable from './OrderTable';
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
    try {
      await API.patch(`orders/${id}/`, { statut: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, statut: newStatus } : o)));
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement des commandes...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Suivi des commandes</h2>
          <p className="text-gray-500 mt-1">Gérez les expéditions et le statut des commandes.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportOrdersCsv(filteredOrders, statusFilter)} 
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg font-bold text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Exporter CSV
          </button>
          <button className="px-4 py-2.5 bg-[#274d00] text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg">
            <FileText size={18} /> Rapports
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par Client ou ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#92B061] font-bold text-sm transition-colors" 
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-4 py-3 rounded-lg border border-gray-200 font-bold text-sm outline-none focus:border-[#92B061] transition-colors bg-white"
          >
            {Object.keys(statusMap).map((key) => <option key={key} value={key}>{statusMap[key]}</option>)}
          </select>
          <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm font-bold text-[#274d00] flex items-center">
            {filteredOrders.length} commandes
          </div>
        </div>
      </div>

      {/* Results Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-24 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-500">Essayez d'ajuster vos filtres.</p>
        </div>
      ) : (
        <OrderTable 
          orders={filteredOrders} 
          onStatusChange={handleStatusUpdate} 
          onOpenDetail={(order) => setSelectedOrder(order)} 
        />
      )}

      <OrderDetailModal 
        isOpen={Boolean(selectedOrder)} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default OrderManagementPage;
