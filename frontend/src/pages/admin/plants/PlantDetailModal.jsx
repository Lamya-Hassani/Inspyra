import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getPlantImageSrc } from './plantHelpers';

const PlantDetailModal = ({ isOpen, plant, onClose, onEdit }) => {
  if (!isOpen || !plant) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass w-full max-w-4xl rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl border border-white/10 animate-float max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 p-2 sm:p-3 bg-white/20 hover:bg-white/40 rounded-xl sm:rounded-2xl transition-all backdrop-blur-md"
        >
          <X />
        </button>

        <div className="w-full md:w-1/2 h-[250px] sm:h-[400px] md:h-auto relative shrink-0">
          <img src={getPlantImageSrc(plant.image)} className="w-full h-full object-cover" alt={plant.nom} />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-[calc(100%-48px)]">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[.4em] text-emerald-400 mb-2 block">
              Premium Collection
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter truncate">
              {plant.nom}
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-12 space-y-8 sm:space-y-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">Fiche d'identité</h4>
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <InfoCard label="Catégorie" value={plant.categorie_nom} />
              <InfoCard label="Prix" value={`${plant.prix} DH`} valueClassName="text-emerald-600" />
              <InfoCard label="Stock" value={`${plant.stock} unités`} />
              <InfoCard label="Santé" value="Excellente" valueClassName="text-emerald-500" />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Description</h4>
            <p className="text-xs sm:text-sm text-emerald-900/70 dark:text-emerald-100/70 leading-relaxed font-medium">
              {plant.description || 'Aucune description détaillée disponible pour le moment.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onEdit}
              className="w-full sm:flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-emerald-500 shadow-xl shadow-emerald-600/20"
            >
              Modifier Spécimen
            </button>
            <button
              onClick={onClose}
              className="w-full sm:px-8 py-4 glass rounded-2xl font-black uppercase tracking-widest text-[10px] text-emerald-900 dark:text-white border border-white/20"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoCard = ({ label, value, valueClassName = 'text-emerald-900 dark:text-white' }) => (
  <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-500/10">
    <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-900/40 dark:text-emerald-100/40 mb-1">
      {label}
    </p>
    <p className={`text-sm sm:text-lg font-black truncate ${valueClassName}`}>{value}</p>
  </div>
);

export default PlantDetailModal;
