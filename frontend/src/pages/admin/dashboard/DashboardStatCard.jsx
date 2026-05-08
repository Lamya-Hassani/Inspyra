import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const colorStyles = {
  emerald: { glow: 'bg-emerald-500', iconWrap: 'bg-emerald-500/10', iconText: 'text-emerald-600 dark:text-emerald-400' },
  blue: { glow: 'bg-sky-500', iconWrap: 'bg-sky-500/10', iconText: 'text-sky-600 dark:text-sky-400' },
  green: { glow: 'bg-green-500', iconWrap: 'bg-green-500/10', iconText: 'text-green-600 dark:text-green-400' },
  purple: { glow: 'bg-violet-500', iconWrap: 'bg-violet-500/10', iconText: 'text-violet-600 dark:text-violet-400' },
};

const DashboardStatCard = ({ title, value, change, isUp, icon: Icon, color }) => (
  <div className="glass p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-white/10 shadow-xl">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${colorStyles[color]?.glow || colorStyles.emerald.glow}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 sm:p-4 rounded-[1rem] sm:rounded-2xl ${colorStyles[color]?.iconWrap || colorStyles.emerald.iconWrap} ${colorStyles[color]?.iconText || colorStyles.emerald.iconText}`}><Icon size={20} className="sm:w-6 sm:h-6" /></div>
      <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>{isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}%</div>
    </div>
    <div><p className="text-[9px] sm:text-[10px] font-black text-emerald-900/40 dark:text-emerald-100/40 uppercase tracking-[0.2em] mb-1">{title}</p><h3 className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-white tabular-nums tracking-tighter truncate leading-none">{value}</h3></div>
  </div>
);

export default DashboardStatCard;
