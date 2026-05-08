import React from 'react';
import { Droplets, Sun, Edit2, Trash2, Eye } from 'lucide-react';
import { getPlantImageSrc } from './plantHelpers';

const PlantCard = ({ plant, onEdit, onDelete, onView }) => {
  return (
    <div className="glass rounded-[2.5rem] p-4 group hover:scale-[1.02] transition-all duration-500 border border-white/10 flex flex-col">
      <div className="relative h-56 lg:h-64 rounded-[2rem] overflow-hidden mb-6 shrink-0">
        <img
          src={getPlantImageSrc(plant.image)}
          alt={plant.nom}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={onEdit}
            className="p-3 glass-bg backdrop-blur-md border border-white/20 rounded-2xl text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-3 glass-bg backdrop-blur-md border border-white/20 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md border border-white/20 ${
              plant.stock > 10 ? 'bg-black/40 text-white' : 'bg-rose-500/80 text-white animate-pulse'
            }`}
          >
            Stock: {plant.stock}
          </span>
        </div>
      </div>

      <div className="px-2 pb-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1 truncate">
              {plant.categorie_nom}
            </p>
            <h3 className="text-xl font-black text-emerald-900 dark:text-white tracking-tight truncate leading-tight group-hover:text-emerald-600 transition-all">
              {plant.nom}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-black text-emerald-600 tabular-nums">{plant.prix} DH</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          <div className="flex items-center gap-2 text-emerald-900/60 dark:text-emerald-100/60 bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <Droplets size={12} className="text-blue-500" />
            <span className="text-[9px] font-black uppercase">{plant.besoinEau || 'Normal'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-900/60 dark:text-emerald-100/60 bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <Sun size={12} className="text-amber-500" />
            <span className="text-[9px] font-black uppercase">{plant.besoinLumiere || 'Moyen'}</span>
          </div>
        </div>

        <button
          onClick={onView}
          className="w-full py-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500 text-emerald-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all border border-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          Détails complets
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
