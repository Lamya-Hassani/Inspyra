import React from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, Save, UploadCloud, X } from 'lucide-react';
import { FALLBACK_PLANT_IMAGE, getPlantImageSrc } from './plantHelpers';

const PlantFormModal = ({
  isOpen,
  isAddMode,
  plant,
  categories,
  previewImage,
  onClose,
  onSubmit,
  onPlantChange,
  onImageSelect,
}) => {
  if (!isOpen || !plant) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl animate-fade-in" onClick={onClose}></div>
      <div className="glass w-full max-w-4xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 relative animate-float border border-white/20 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all z-10">
          <X />
        </button>

        <div className="flex items-center gap-4 mb-6 sm:mb-10">
          <div className="bg-emerald-500/10 p-3 sm:p-4 rounded-2xl text-emerald-500 shrink-0">
            {isAddMode ? <Plus size={24} className="sm:w-8 sm:h-8" /> : <Edit2 size={24} className="sm:w-8 sm:h-8" />}
          </div>
          <div>
            <h3 className="text-xl sm:text-3xl font-black text-emerald-900 dark:text-white tracking-tight">
              {isAddMode ? 'Nouvelle Plante' : 'Modifier la Plante'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800/50 dark:text-emerald-100/50 font-medium">
              Configurez les caractéristiques de votre spécimen.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <TextInput label="Nom de la plante" value={plant.nom} required onChange={(v) => onPlantChange('nom', v)} placeholder="ex: Monstera Deliciosa..." className="sm:col-span-2" />
          <TextInput label="Nom Scientifique" value={plant.nomScientifique || ''} onChange={(v) => onPlantChange('nomScientifique', v)} placeholder="ex: Monstera deliciosa..." />
          <TextInput label="Prix (DH)" type="number" required value={plant.prix} onChange={(v) => onPlantChange('prix', v)} />
          <TextInput label="Stock" type="number" required value={plant.stock} onChange={(v) => onPlantChange('stock', parseInt(v || 0, 10))} />

          <div>
            <Label>Catégorie</Label>
            <select
              value={plant.categorie || 1}
              onChange={(e) => onPlantChange('categorie', parseInt(e.target.value, 10))}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-[1rem] sm:rounded-2xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-emerald-950 dark:text-white text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Label>Image de la plante</Label>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
              <label className="relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 px-6 py-8 text-center hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all">
                <input type="file" accept="image/*" onChange={onImageSelect} className="sr-only" />
                <div className="space-y-2">
                  <UploadCloud className="mx-auto w-8 h-8 text-emerald-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                    Cliquer pour televerser l'image
                  </p>
                  <p className="text-[10px] text-emerald-900/50 dark:text-emerald-100/50">PNG, JPG ou WEBP</p>
                </div>
              </label>
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 mx-auto sm:mx-0 bg-white/20">
                <img src={previewImage || getPlantImageSrc(plant.image) || FALLBACK_PLANT_IMAGE} className="w-full h-full object-cover" alt="preview" />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Label>Description</Label>
            <textarea
              rows="2"
              value={plant.description || ''}
              onChange={(e) => onPlantChange('description', e.target.value)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-[1rem] sm:rounded-2xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium text-xs sm:text-sm"
              placeholder="Décrivez votre plante..."
            />
          </div>

          <TextInput label="Eau" value={plant.besoinEau || ''} onChange={(v) => onPlantChange('besoinEau', v)} placeholder="ex: 1x / semaine" />
          <TextInput label="Lumière" value={plant.besoinLumiere || ''} onChange={(v) => onPlantChange('besoinLumiere', v)} placeholder="ex: Indirecte" />
          <div>
            <Label>Entretien</Label>
            <select
              value={plant.niveauEntretien || 'Facile'}
              onChange={(e) => onPlantChange('niveauEntretien', e.target.value)}
              className="w-full px-4 sm:px-6 py-2 rounded-xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-xs"
            >
              <option value="Facile">Facile</option>
              <option value="Modéré">Modéré</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>

          <button className="sm:col-span-2 lg:col-span-3 mt-4 py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 text-sm sm:text-lg uppercase tracking-wider">
            <Save size={20} className="sm:w-6 sm:h-6" />
            {isAddMode ? 'Créer Spécimen' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Label = ({ children }) => (
  <label className="block text-[9px] sm:text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest pl-2">
    {children}
  </label>
);

const TextInput = ({ label, className = '', onChange, ...props }) => (
  <div className={className}>
    <Label>{label}</Label>
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-[1rem] sm:rounded-2xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-sm"
    />
  </div>
);

export default PlantFormModal;
