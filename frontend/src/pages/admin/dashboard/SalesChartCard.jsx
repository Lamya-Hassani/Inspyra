import React from 'react';

const SalesChartCard = () => {
  const data = [35, 60, 40, 75, 50, 85, 65, 80, 55, 90, 75, 95];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const scale = [100, 75, 50, 25, 0];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Analyse des Ventes</h3>
          <p className="text-xs font-bold text-[#92B061] uppercase tracking-widest mt-1">Revenus mensuels (DH)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#274d00]"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ventes</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 h-64">
        {/* Y-Axis Scale */}
        <div className="flex flex-col justify-between text-[10px] font-bold text-gray-400 py-2">
          {scale.map(s => <span key={s}>{s}%</span>)}
        </div>

        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 border-l border-b border-gray-100 px-2 pb-2">
          {data.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div 
                className="w-full bg-[#92B061]/20 hover:bg-[#274d00] rounded-t transition-colors cursor-pointer relative" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
              <span className="absolute -bottom-6 text-[9px] font-bold text-gray-400 uppercase">
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Spacer for bottom labels */}
      <div className="h-4"></div>
    </div>
  );
};

export default SalesChartCard;
