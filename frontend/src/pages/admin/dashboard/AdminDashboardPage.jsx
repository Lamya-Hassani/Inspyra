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
    link.setAttribute('download', 'Inspyra_Performance_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-600"><Loader2 className="w-12 h-12 animate-spin" /><p className="font-black uppercase tracking-widest text-sm text-center">Calcul des performances botaniques...</p></div>;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="relative overflow-hidden glass rounded-[2rem] sm:rounded-[3rem] border border-white/10 p-6 sm:p-10">
        <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-20 w-56 h-56 rounded-full bg-emerald-800/20 blur-3xl"></div>
        <div className="relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="max-w-xl"><h2 className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-white tracking-tight leading-tight">Bonjour, <span className="text-gradient">Admin</span></h2><p className="text-xs sm:text-sm text-emerald-800/50 dark:text-emerald-100/50 font-medium mt-1">Le jardin d'Inspyra est en pleine croissance. Voici vos analyses actuelles.</p></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto"><button className="glass px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-100 hover:bg-white/40 transition-all text-[10px] uppercase tracking-widest"><Calendar size={16} className="text-emerald-500" />Derniers 30 jours</button><button onClick={exportReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"><Download size={16} />Exporter le Rapport</button></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{stats.map((stat, i) => <DashboardStatCard key={i} {...stat} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><SalesChartCard /><RecentActivityCard activity={data?.recent_activity || []} /></div>
    </div>
  );
};

export default AdminDashboardPage;
