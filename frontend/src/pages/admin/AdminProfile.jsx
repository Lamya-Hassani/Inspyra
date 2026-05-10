import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { User, Mail, Shield, Phone, MapPin, Globe, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: ''
  });
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await userService.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles et de contact</p>
        </div>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-lg text-sm font-bold border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-100 text-green-700' 
                : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-1 shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'Admin'}`} 
                alt="avatar" 
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-sm font-bold text-[#92B061] uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-[#92B061]" /> Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} className="text-[#92B061]" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} className="text-[#92B061]" /> Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                value={profileData.telephone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} className="text-[#92B061]" /> Pays
              </label>
              <input
                type="text"
                name="pays"
                value={profileData.pays}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-[#92B061]" /> Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={profileData.adresse}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-[#92B061]" /> Ville
              </label>
              <input
                type="text"
                name="ville"
                value={profileData.ville}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-[#92B061]" /> Code Postal
              </label>
              <input
                type="text"
                name="codePostal"
                value={profileData.codePostal}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#92B061] focus:ring-4 focus:ring-[#92B061]/5 transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#274d00] text-white rounded-lg text-sm font-bold hover:bg-[#1a3300] transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
