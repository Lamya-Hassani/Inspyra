import React, { useEffect, useState } from 'react';
import { Search, Loader2, Download, Sparkles, User, Sun, Droplets, Trophy, Target } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

const PreferenceManagement = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const response = await API.get('recommendations/admin/all/');
        setPreferences(response.data);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
        toast.error('Erreur lors du chargement des préférences');
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const getPreferenceLabel = (key, value) => {
    const labels = {
      light_level: { LOW: 'Faible', MEDIUM: 'Indirecte', HIGH: 'Vive' },
      watering_frequency: { RARE: 'Rare', MODERATE: 'Modérée', FREQUENT: 'Fréquente' },
      experience_level: { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', EXPERT: 'Expert' },
      primary_goal: { DECORATION: 'Décoration', AIR_PURIFYING: 'Purification', MEDICINAL: 'Médicinal', COLLECTION: 'Collection' }
    };
    return labels[key]?.[value] || value;
  };

  const filteredPrefs = preferences.filter(p => 
    p.user_username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['Utilisateur', 'Lumière', 'Arrosage', 'Expérience', 'Objectif'];
    const rows = filteredPrefs.map(p => [
      p.user_username,
      getPreferenceLabel('light_level', p.light_level),
      getPreferenceLabel('watering_frequency', p.watering_frequency),
      getPreferenceLabel('experience_level', p.experience_level),
      getPreferenceLabel('primary_goal', p.primary_goal)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_preferences.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement des profils botaniques...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profils Botaniques</h2>
          <p className="text-gray-500 mt-1">Consultez les préférences environnementales de vos clients.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-6 py-3 bg-[#274d00] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg"
        >
          <Download size={20} /> Exporter CSV
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher par nom d'utilisateur..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#92B061] font-bold text-sm transition-colors shadow-sm" 
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Utilisateur</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Lumière</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Arrosage</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Expérience</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Objectif Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrefs.length > 0 ? (
                filteredPrefs.map((pref) => (
                  <tr key={pref.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#92B061]/10 flex items-center justify-center text-[#274d00]">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-sm text-gray-900">{pref.user_username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Sun size={14} className="text-amber-500" />
                        <span className="text-sm font-medium text-gray-900">{getPreferenceLabel('light_level', pref.light_level)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{getPreferenceLabel('watering_frequency', pref.watering_frequency)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-emerald-600" />
                        <span className="text-sm font-medium text-gray-900">{getPreferenceLabel('experience_level', pref.experience_level)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">{getPreferenceLabel('primary_goal', pref.primary_goal)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
          <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-bold italic">Aucun test de profil botanique n'a été effectué par les clients pour le moment.</p>
                  </td>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PreferenceManagement;
