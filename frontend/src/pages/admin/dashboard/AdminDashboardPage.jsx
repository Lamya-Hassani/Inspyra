import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Users, ShoppingBag, Leaf, Calendar, Loader2, Download } from 'lucide-react';
import API from '../../../services/api';
import DashboardStatCard from './DashboardStatCard';
import SalesChartCard from './SalesChartCard';
import RecentActivityCard from './RecentActivityCard';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('products/stats/');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = useMemo(
    () => [
      { title: 'Ventes Totales', value: `${data?.total_sales || 0} DH`, change: '12.5', isUp: true, icon: ShoppingBag, color: 'emerald' },
      { title: 'Clients Actifs', value: data?.client_count || 0, change: '15.2', isUp: true, icon: Users, color: 'blue' },
      { title: 'Plantes en Stock', value: data?.plant_count || 0, change: '2.4', isUp: false, icon: Leaf, color: 'green' },
      { title: 'Commandes Cumulees', value: data?.order_count || 0, change: '18.1', isUp: true, icon: TrendingUp, color: 'purple' },
    ],
    [data]
  );

  const exportReport = () => {
    if (!data) return;
    const headers = ['Metrique', 'Valeur'];
    const rows = [['Ventes Totales', `${data.total_sales} DH`], ['Nombre de Clients', data.client_count], ['Total Plantes', data.plant_count], ['Total Commandes', data.order_count], ['Date du Rapport', new Date().toLocaleDateString()]];
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${rows.map((e) => e.join(',')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Inspyra_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement des données...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-[#6D58C7] rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Administration</p>
            </div>
            <h2 className="text-4xl font-black text-[#274d00] tracking-tight">Bienvenue, Admin</h2>
            <p className="text-gray-500 mt-2 font-medium italic">"L'état actuel de votre boutique Inspyra en un coup d'œil."</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportReport} className="px-8 py-4 bg-[#274d00] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#6D58C7] transition-all shadow-xl hover:shadow-purple-100">
              <Download size={16} /> Exporter Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <DashboardStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChartCard />
        </div>
        <div>
          <RecentActivityCard activity={data?.recent_activity || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
