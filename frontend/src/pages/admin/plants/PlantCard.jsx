import React from 'react';
import { Droplets, Sun, Edit2, Trash2, Eye } from 'lucide-react';
import { getPlantImageSrc } from './plantHelpers';

const PlantCard = ({ plant, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col group relative overflow-hidden">
      <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6 shrink-0">
        <img
          src={getPlantImageSrc(plant.image)}
          alt={plant.nom}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={onEdit}
            className="w-10 h-10 bg-white rounded-xl text-[#6D58C7] hover:bg-[#6D58C7] hover:text-white shadow-xl flex items-center justify-center transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 bg-white rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white shadow-xl flex items-center justify-center transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-md ${
              plant.stock > 10 ? 'bg-black/60 text-white' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'
            }`}
          >
            {plant.stock} en stock
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-1 justify-center">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xl font-black text-[#274d00] truncate tracking-tight">
            {plant.nom}
          </h3>
          <p className="text-lg font-black text-[#274d00] whitespace-nowrap">{plant.prix} DH</p>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
