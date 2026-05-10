import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Settings, Leaf, User, Camera, LogOut, 
  ChevronRight, Calendar, Mail, Shield, Sparkles 
} from 'lucide-react';
import recommendationService from '../services/recommendationService';
import userService from '../services/userService';
import orderService from '../services/orderService';
import { getImageUrl } from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  const [userPrefs, setUserPrefs] = useState(null);
  const [recoPlants, setRecoPlants] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData({
          username: data.username || '',
          email: data.email || '',
          telephone: data.telephone || '',
          adresse: data.adresse || '',
          ville: data.ville || '',
          codePostal: data.codePostal || '',
          pays: data.pays || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        setRecoLoading(true);
        const prefs = await recommendationService.getPreferences();
        setUserPrefs(prefs);
        const plants = await recommendationService.getRecommendations();
        setRecoPlants(plants);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setRecoLoading(false);
      }
    };
    
    if (activeTab === 'preferences') {
      fetchPrefs();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await userService.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getHistory();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const tabs = [
    { id: 'orders', label: 'Mes Archives', icon: Package },
    { id: 'settings', label: 'Profil & Sécurité', icon: Settings },
    { id: 'preferences', label: 'Style Botanique', icon: Leaf },
  ];

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-accent/20 text-accent border-accent/20';
      case 'SHIPPED': return 'bg-lavender/20 text-lavender border-lavender/20';
      default: return 'bg-primary/20 text-primary border-primary/20';
    }
  };

  const getPreferenceLabel = (key, value) => {
    const labels = {
      light_level: { LOW: 'Faible', MEDIUM: 'Indirecte', HIGH: 'Vive' },
      watering_frequency: { RARE: 'Rare', MODERATE: 'Modérée', FREQUENT: 'Fréquente' },
      experience_level: { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', EXPERT: 'Expert' },
      primary_goal: { DECORATION: 'Décoration', AIR_PURIFYING: 'Purification', MEDICINAL: 'Médicinal', COLLECTION: 'Collection' }
    };
    return labels[key]?.[value] || value;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-5 pb-20">
        
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-[#6D58C7] rounded-full"></div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6D58C7]">Espace Client</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#274d00] mb-4r">Mon Compte</h1>
          <p className="text-lg text-gray-400 mt-4 font-medium italic max-w-2xl">
            "Bienvenue dans votre sanctuaire végétal. Gérez vos commandes et vos préférences ici."
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-[#274d00] to-[#6D58C7] text-white flex flex-col items-center relative overflow-hidden">
                {/* Subtle Decorative Circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4 border-4 border-white/30 shadow-lg">
                  <User size={48} strokeWidth={1.5} />
                </div>
                <h2 className="font-bold text-xl tracking-tight">{user?.username}</h2>
                <div className="mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{user?.role || 'Client Privilégié'}</p>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        isActive 
                        ? 'bg-purple-50 text-[#6D58C7] shadow-sm ring-1 ring-purple-100' 
                        : 'text-gray-500 hover:bg-green-50 hover:text-[#274d00]'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#6D58C7]' : 'text-gray-400'} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="text-[#274d00]" size={18} />
                      </div>
                      Mes Commandes
                    </h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                      {orders.length} Expéditions
                    </span>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium italic mb-6">Votre historique est encore vierge.</p>
                      <Link to="/shop" className="inline-block px-8 py-3 bg-[#274d00] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#1a3400] transition-all">
                        Découvrir la boutique
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Commande</th>
                              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date d'achat</th>
                              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</th>
                              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Statut</th>
                              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-purple-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                                      <Package className="text-[#274d00]" size={18} />
                                    </div>
                                    <span className="font-black text-[#6D58C7] text-sm">#ORD-{order.id}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                                      {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-sm font-black text-gray-800">{order.total} MAD</td>
                                <td className="px-8 py-6">
                                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                    order.statut === 'DELIVERED' 
                                    ? 'bg-green-50 text-[#274d00] border-green-100 shadow-sm shadow-green-50' 
                                    : 'bg-purple-50 text-[#6D58C7] border-purple-100 shadow-sm shadow-purple-50'
                                  }`}>
                                    {order.statut}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <button className="w-10 h-10 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#6D58C7] hover:text-white flex items-center justify-center mx-auto transition-all shadow-sm">
                                    <ChevronRight size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                >
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Settings className="text-[#6D58C7]" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Paramètres du Profil</h2>
                  </div>

                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-[11px] font-black uppercase tracking-widest border ${
                      message.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-[#274d00]' 
                      : 'bg-rose-50 border-rose-200 text-rose-500'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identifiant</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact</label>
                        <input
                          type="text"
                          name="telephone"
                          value={profileData.telephone}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Localisation</label>
                        <input
                          type="text"
                          name="pays"
                          value={profileData.pays}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Adresse complète</label>
                        <input
                          type="text"
                          name="adresse"
                          value={profileData.adresse}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Ville</label>
                        <input
                          type="text"
                          name="ville"
                          value={profileData.ville}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Code Postal</label>
                        <input
                          type="text"
                          name="codePostal"
                          value={profileData.codePostal}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={updateLoading}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#274d00] to-[#6D58C7] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        {updateLoading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <Leaf className="text-[#274d00]" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">ADN Botanique</h2>
                      </div>
                      <Link to="/plant-finder" className="text-[10px] font-black text-[#6D58C7] hover:text-[#274d00] uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full transition-all">
                        Refaire le diagnostic
                      </Link>
                    </div>

                    {recoLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-purple-100 border-t-[#6D58C7] rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Analyse en cours...</p>
                      </div>
                    ) : userPrefs && userPrefs.experience_level ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Lumière', value: getPreferenceLabel('light_level', userPrefs.light_level), color: 'green' },
                          { label: 'Arrosage', value: getPreferenceLabel('watering_frequency', userPrefs.watering_frequency), color: 'purple' },
                          { label: 'Expérience', value: getPreferenceLabel('experience_level', userPrefs.experience_level), color: 'green' },
                          { label: 'Objectif', value: getPreferenceLabel('primary_goal', userPrefs.primary_goal), color: 'purple' },
                        ].map((item, i) => (
                          <div key={i} className={`p-5 rounded-2xl border ${item.color === 'green' ? 'bg-green-50 border-green-100' : 'bg-purple-50 border-purple-100'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${item.color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>{item.label}</p>
                            <p className="text-sm font-bold text-gray-800 uppercase">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic mb-8">Définissez votre profil pour des recommandations sur-mesure.</p>
                        <Link to="/plant-finder" className="px-10 py-4 bg-[#274d00] text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg">
                          Initier le test
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {!recoLoading && recoPlants.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Curation pour vous</h3>
                        <div className="h-px bg-gray-100 flex-grow"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recoPlants.map((plant) => (
                          <Link 
                            key={plant.id} 
                            to={`/product/${plant.id}`}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all group"
                          >
                            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                              <img 
                                src={getImageUrl(plant.image)} 
                                alt={plant.nom} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-white/20">
                                <p className="text-[9px] font-black text-[#274d00] uppercase tracking-tighter">{plant.prix} MAD</p>
                              </div>
                            </div>
                            <div className="p-5">
                              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">{plant.categorie_nom}</p>
                              <h4 className="font-bold text-gray-800 text-sm tracking-tight">{plant.nom}</h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;