import React, { useEffect, useState } from 'react';
import { Search, Plus, Loader2, Edit2, Trash2, Tag } from 'lucide-react';
import API from '../../../services/api';
import { toast } from 'react-hot-toast';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState({ nom: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('products/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await API.delete(`products/categories/${id}/`);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Catégorie supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const response = await API.put(`products/categories/${activeCategory.id}/`, activeCategory);
        setCategories(prev => prev.map(c => c.id === activeCategory.id ? response.data : c));
        toast.success('Catégorie mise à jour');
      } else {
        const response = await API.post('products/categories/', activeCategory);
        setCategories(prev => [...prev, response.data]);
        toast.success('Catégorie ajoutée');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement des catégories...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des catégories</h2>
          <p className="text-gray-500 mt-1">Organisez vos plantes par types et variétés.</p>
        </div>
        <button 
          onClick={() => { setEditMode(false); setActiveCategory({ nom: '', description: '' }); setShowModal(true); }} 
          className="px-6 py-3 bg-[#274d00] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg"
        >
          <Plus size={20} /> Nouvelle catégorie
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une catégorie..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#92B061] font-bold text-sm transition-colors" 
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-[#92B061]">
                        <Tag size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{cat.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-md truncate">{cat.description || 'Pas de description.'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditMode(true); setActiveCategory(cat); setShowModal(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-xl p-8 relative shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editMode ? 'Modifier catégorie' : 'Nouvelle catégorie'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nom</label>
                <input 
                  type="text" 
                  required 
                  value={activeCategory.nom} 
                  onChange={(e) => setActiveCategory({ ...activeCategory, nom: e.target.value })} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  rows="3" 
                  value={activeCategory.description} 
                  onChange={(e) => setActiveCategory({ ...activeCategory, description: e.target.value })} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#92B061] outline-none text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-3 bg-[#274d00] text-white rounded-lg font-bold hover:bg-[#1e3b00] shadow-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;
