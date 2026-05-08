import React from 'react';

const SalesChartCard = () => (
  <div className="lg:col-span-2 glass p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] flex flex-col gap-6 sm:gap-8 border border-white/10">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div><h3 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-white tracking-tight">Analyse des Ventes</h3><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Performances Mensuelles</p></div>
      <div className="flex items-center gap-4 sm:gap-6"><div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-emerald-500"></div><span className="text-[8px] sm:text-[10px] font-black uppercase opacity-50 tracking-widest">Revenus</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-emerald-100 dark:bg-black/40"></div><span className="text-[8px] sm:text-[10px] font-black uppercase opacity-50 tracking-widest">Objectif</span></div></div>
    </div>
    <div className="h-56 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 py-4 px-1 overflow-x-auto custom-scrollbar">
      {[35, 60, 40, 75, 50, 85, 65, 80, 55, 90, 75, 95].map((h, i) => (
        <div key={i} className="flex-1 min-w-[30px] sm:min-w-0 group relative flex flex-col items-center h-full justify-end">
          <div className="w-full bg-emerald-500/10 group-hover:bg-emerald-500/40 rounded-[0.5rem] sm:rounded-2xl transition-all duration-700 cursor-pointer relative" style={{ height: `${h}%` }}><div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
          <span className="text-[8px] sm:text-[10px] font-black opacity-30 mt-3 sm:mt-4 uppercase tracking-tighter">{['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SalesChartCard;
