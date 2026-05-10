import React from 'react';

const colorStyles = {
  emerald: { iconWrap: 'bg-green-50', iconText: 'text-[#274d00]' },
  blue: { iconWrap: 'bg-purple-50', iconText: 'text-[#6D58C7]' },
  green: { iconWrap: 'bg-green-50', iconText: 'text-[#274d00]' },
  purple: { iconWrap: 'bg-purple-50', iconText: 'text-[#6D58C7]' },
};

const DashboardStatCard = ({ title, value, icon: Icon, color }) => {
  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${style.iconWrap} ${style.iconText} transition-colors group-hover:bg-[#6D58C7] group-hover:text-white`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
          <h3 className="text-2xl font-black text-[#274d00] tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
