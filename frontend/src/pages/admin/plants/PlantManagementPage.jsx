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
    await API.delete(`products/plantes/${id}/`);
    setPlants((prev) => prev.filter((p) => p.id !== id));
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

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <HeaderStats plants={plants} categories={categories} />
      <TopBar onAdd={() => setShowAddModal(true)} />
      <FilterBar
        categories={categories}
        filteredCount={filteredPlants.length}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        setSearchTerm={setSearchTerm}
        setSelectedCategory={setSelectedCategory}
      />
      {filteredPlants.length === 0 && <EmptyState />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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

      <PlantFormModal
        isOpen={showAddModal || showEditModal}
        isAddMode={showAddModal}
        plant={showAddModal ? newPlant : activePlant}
        categories={categories}
        previewImage={showAddModal ? newPlantPreview : activePlantPreview}
        onClose={closeFormModal}
        onSubmit={showAddModal ? submitAddPlant : submitEditPlant}
        onPlantChange={(key, value) => showAddModal ? setNewPlant((prev) => ({ ...prev, [key]: value })) : setActivePlant((prev) => ({ ...prev, [key]: value }))}
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

const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-600">
    <Loader2 className="w-12 h-12 animate-spin" />
    <p className="font-black uppercase tracking-widest text-sm text-center">Inspirations botaniques en cours...</p>
  </div>
);

const EmptyState = () => (
  <div className="glass p-20 rounded-[3rem] text-center space-y-4">
    <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-500"><AlertCircle size={40} /></div>
    <h3 className="text-2xl font-black text-emerald-900 dark:text-white">Aucune plante trouvée</h3>
    <p className="text-emerald-800/50 dark:text-emerald-100/50 font-medium">Ajustez vos filtres pour explorer d'autres variétés.</p>
  </div>
);

const HeaderStats = ({ plants, categories }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Metric title="Catalogue Total" value={plants.length} />
    <Metric title="Stock Critique" value={plants.filter((p) => p.stock <= 5).length} valueClassName="text-rose-500" />
    <Metric title="Catégories" value={categories.length} />
  </div>
);

const Metric = ({ title, value, valueClassName = 'text-emerald-900 dark:text-white' }) => (
  <div className="glass rounded-[1.5rem] p-5 border border-white/10"><p className="text-xs font-black tracking-widest uppercase text-emerald-500">{title}</p><p className={`text-3xl font-black mt-2 ${valueClassName}`}>{value}</p></div>
);

const TopBar = ({ onAdd }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h2 className="text-4xl font-black text-emerald-900 dark:text-white tracking-tight">Catalogue de <span className="text-gradient">Plantes</span></h2><p className="text-emerald-800/50 dark:text-emerald-100/50 font-medium">Gérez votre inventaire avec une précision botanique.</p></div><button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"><Plus size={20} />Ajouter une Plante</button></div>
);

const FilterBar = ({ categories, filteredCount, searchTerm, selectedCategory, setSearchTerm, setSelectedCategory }) => (
  <div className="flex flex-col lg:flex-row gap-4">
    <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40" /><input type="text" placeholder="Rechercher par nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full glass pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all text-sm" /></div>
    <div className="flex flex-col sm:flex-row gap-4"><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="glass px-6 py-4 rounded-[1.5rem] font-bold text-emerald-800 dark:text-emerald-100 appearance-none bg-none outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"><option value="ALL">Toutes les Catégories</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}</select><div className="glass px-6 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-emerald-500 text-sm">{filteredCount} Résultats</div></div>
  </div>
);

export default PlantManagementPage;
