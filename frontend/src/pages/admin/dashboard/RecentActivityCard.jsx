import React from 'react';
import { Activity, ShoppingBag } from 'lucide-react';

const RecentActivityCard = ({ activity = [] }) => (
  <div className="lg:col-span-1 glass p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 bg-emerald-500"></div>
    <div className="flex justify-between items-center mb-6 sm:mb-8"><h3 className="text-lg sm:text-xl font-black text-emerald-900 dark:text-white tracking-tight">Activité Récente</h3><div className="p-2 sm:p-2.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Activity size={16} /></div></div>
    <div className="flex-1 space-y-3 sm:space-y-4 overflow-auto custom-scrollbar pr-1 max-h-[350px] sm:max-h-[400px]">
      {activity.map((item, i) => (
        <div key={i} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] bg-white/20 dark:bg-emerald-950/10 border border-white/10 hover:border-emerald-500/30 hover:bg-white/40 transition-all group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-600 shrink-0 group-hover:rotate-12 transition-transform"><ShoppingBag size={18} className="sm:w-5 sm:h-5" /></div>
          <div className="flex-1 min-w-0"><p className="text-xs sm:text-sm font-black text-emerald-900 dark:text-white truncate uppercase tracking-tighter">{item.title}</p><p className="text-[9px] sm:text-[10px] font-bold text-emerald-500 tracking-widest truncate">{item.desc}</p></div>
          <p className="text-[8px] sm:text-[10px] font-black text-emerald-900/40 dark:text-emerald-100/40 uppercase leading-none">{item.time}</p>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivityCard;
