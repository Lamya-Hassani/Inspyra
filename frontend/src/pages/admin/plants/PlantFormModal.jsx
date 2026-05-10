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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-3xl rounded-xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gray-50 p-3 rounded-lg text-[#274d00]">
            {isAddMode ? <Plus size={24} /> : <Edit2 size={24} />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isAddMode ? 'Ajouter une plante' : 'Modifier la plante'}
            </h3>
            <p className="text-sm text-gray-500">Remplissez les informations ci-dessous.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Nom de la plante</Label>
            <input 
              type="text" 
              required 
              value={plant.nom} 
              onChange={(e) => onPlantChange('nom', e.target.value)} 
              placeholder="ex: Monstera Deliciosa"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm"
            />
          </div>

          <div>
            <Label>Nom Scientifique</Label>
            <input 
              type="text" 
              value={plant.nomScientifique || ''} 
              onChange={(e) => onPlantChange('nomScientifique', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm"
            />
          </div>

          <div>
            <Label>Catégorie</Label>
            <select
              value={plant.categorie || 1}
              onChange={(e) => onPlantChange('categorie', parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Prix (MAD)</Label>
            <input 
              type="number" 
              required 
              value={plant.prix} 
              onChange={(e) => onPlantChange('prix', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm"
            />
          </div>

          <div>
            <Label>Stock</Label>
            <input 
              type="number" 
              required 
              value={plant.stock} 
              onChange={(e) => onPlantChange('stock', parseInt(e.target.value || 0, 10))} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#92B061] hover:bg-gray-50 transition-colors">
                <input type="file" accept="image/*" onChange={onImageSelect} className="hidden" />
                <UploadCloud size={24} className="text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Choisir une image</span>
              </label>
              <div className="w-20 h-20 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                <img src={previewImage || getPlantImageSrc(plant.image) || FALLBACK_PLANT_IMAGE} className="w-full h-full object-cover" alt="preview" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              rows="3"
              value={plant.description || ''}
              onChange={(e) => onPlantChange('description', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none text-sm resize-none"
              placeholder="Décrivez la plante..."
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div>
              <Label>Eau</Label>
              <input type="text" value={plant.besoinEau || ''} onChange={(e) => onPlantChange('besoinEau', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-sm font-bold" />
            </div>
            <div>
              <Label>Lumière</Label>
              <input type="text" value={plant.besoinLumiere || ''} onChange={(e) => onPlantChange('besoinLumiere', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-sm font-bold" />
            </div>
            <div>
              <Label>Entretien</Label>
              <select
                value={plant.niveauEntretien || 'Facile'}
                onChange={(e) => onPlantChange('niveauEntretien', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none text-sm font-bold bg-white"
              >
                <option value="Facile">Facile</option>
                <option value="Modéré">Modéré</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          <button className="md:col-span-2 mt-4 py-4 bg-[#274d00] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg">
            <Save size={20} />
            {isAddMode ? 'Ajouter au catalogue' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Label = ({ children }) => (
  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
    {children}
  </label>
);

export default PlantFormModal;
