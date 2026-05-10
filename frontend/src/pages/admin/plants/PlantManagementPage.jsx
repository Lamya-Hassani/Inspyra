import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import API from '../../../services/api';
import PlantCard from './PlantCard';
import PlantFormModal from './PlantFormModal';
import PlantDetailModal from './PlantDetailModal';
import { buildPlantFormData, emptyPlant } from './plantHelpers';

const PlantManagementPage = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newPlant, setNewPlant] = useState(emptyPlant);
  const [activePlant, setActivePlant] = useState(null);
  const [newPlantImageFile, setNewPlantImageFile] = useState(null);
  const [activePlantImageFile, setActivePlantImageFile] = useState(null);
  const [newPlantPreview, setNewPlantPreview] = useState('');
  const [activePlantPreview, setActivePlantPreview] = useState('');

  const closeFormModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setNewPlantImageFile(null);
    setActivePlantImageFile(null);
    setNewPlantPreview('');
    setActivePlantPreview('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantsRes, catsRes] = await Promise.all([API.get('products/plantes/'), API.get('products/categories/')]);
        setPlants(plantsRes.data);
        setCategories(catsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPlants = useMemo(
    () =>
      plants.filter((plant) => {
        const matchesSearch = plant.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || plant.categorie === parseInt(selectedCategory, 10);
        return matchesSearch && matchesCategory;
      }),
    [plants, searchTerm, selectedCategory]
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette plante du catalogue ?')) return;
    try {
      await API.delete(`products/plantes/${id}/`);
      setPlants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleImageSelection = (event, mode) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (mode === 'add') {
      setNewPlantImageFile(file);
      setNewPlantPreview(preview);
    } else {
      setActivePlantImageFile(file);
      setActivePlantPreview(preview);
    }
  };

  const submitAddPlant = async (event) => {
    event.preventDefault();
    const payload = buildPlantFormData(newPlant, newPlantImageFile, false);
    const response = await API.post('products/plantes/', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    setPlants((prev) => [...prev, response.data]);
    setNewPlant(emptyPlant);
    closeFormModal();
  };

  const submitEditPlant = async (event) => {
    event.preventDefault();
    const payload = buildPlantFormData(activePlant, activePlantImageFile, true);
    const response = await API.put(`products/plantes/${activePlant.id}/`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    setPlants((prev) => prev.map((p) => (p.id === activePlant.id ? response.data : p)));
    closeFormModal();
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement du catalogue...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Top Bar */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-[#6D58C7] rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Inventaire</p>
            </div>
            <h2 className="text-4xl font-black text-[#274d00] tracking-tight">Gestion des plantes</h2>
            <p className="text-gray-500 mt-2 font-medium italic">"Consultez et modifiez votre catalogue botanique."</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="px-8 py-4 bg-[#274d00] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#6D58C7] transition-all shadow-xl hover:shadow-purple-100"
          >
            <Plus size={20} /> Nouvelle Plante
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6D58C7] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une espèce par son nom..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none font-bold text-sm transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="px-6 py-4 rounded-2xl border border-gray-100 font-black text-[11px] uppercase tracking-widest outline-none focus:border-[#6D58C7] transition-all bg-white cursor-pointer shadow-sm"
          >
            <option value="ALL">Toutes les catégories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
          </select>
          <div className="px-6 py-4 rounded-2xl bg-[#274d00] text-white text-[11px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-green-100">
            {filteredPlants.length} Résultats
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredPlants.length === 0 ? (
        <div className="py-24 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune plante trouvée</h3>
          <p className="text-gray-500">Essayez d'ajuster vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onEdit={() => { setActivePlant(plant); setShowEditModal(true); }}
              onDelete={() => handleDelete(plant.id)}
              onView={() => { setActivePlant(plant); setShowDetailModal(true); }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PlantFormModal
        isOpen={showAddModal || showEditModal}
        isAddMode={showAddModal}
        plant={showAddModal ? newPlant : activePlant}
        categories={categories}
        previewImage={showAddModal ? newPlantPreview : activePlantPreview}
        onClose={closeFormModal}
        onSubmit={showAddModal ? submitAddPlant : submitEditPlant}
        onPlantChange={(key, value) => showAddModal ? setNewPlant(prev => ({ ...prev, [key]: value })) : setActivePlant(prev => ({ ...prev, [key]: value }))}
        onImageSelect={(event) => handleImageSelection(event, showAddModal ? 'add' : 'edit')}
      />

      <PlantDetailModal
        isOpen={showDetailModal}
        plant={activePlant}
        onClose={() => setShowDetailModal(false)}
        onEdit={() => { setShowDetailModal(false); setShowEditModal(true); }}
      />
    </div>
  );
};

const MetricCard = ({ title, value, isWarning }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${isWarning ? 'text-red-500' : 'text-[#274d00]'}`}>{value}</p>
  </div>
);

export default PlantManagementPage;
