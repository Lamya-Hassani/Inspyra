import React, { useEffect, useMemo, useState } from 'react';
import { Search, UserPlus, Loader2, Download } from 'lucide-react';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import UserDetailModal from './UserDetailModal';
import { emptyUser, getFilteredUsers, getVisibleUsers } from './userHelpers';

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [newUser, setNewUser] = useState(emptyUser);
  const [detailUser, setDetailUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const visible = getVisibleUsers(users, currentUser?.role);
    return getFilteredUsers(visible, searchTerm, filter, currentUser?.role);
  }, [users, currentUser, searchTerm, filter]);

  const handleAddUser = async (event) => {
    event.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }
    try {
      const response = await API.post('users/', newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser(emptyUser);
      setShowAddModal(false);
      toast.success('Membre ajouté');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (activeUser.password && activeUser.password !== activeUser.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }
    
    try {
      const { confirmPassword, ...updateData } = activeUser;
      if (!updateData.password) delete updateData.password;

      const response = await API.put(`users/${activeUser.id}/`, updateData);
      setUsers((prev) => prev.map((u) => (u.id === activeUser.id ? response.data : u)));
      setShowEditModal(false);
      toast.success('Membre mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleActive = (id, currentStatus) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: !currentStatus } : u)));

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[#274d00]">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-bold text-sm uppercase tracking-widest">Chargement des membres...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h2>
          <p className="text-gray-500 mt-1">Gérez les rôles et les accès de votre communauté.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="px-6 py-3 bg-[#274d00] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg"
        >
          <UserPlus size={20} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#92B061] font-bold text-sm transition-colors" 
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="px-4 py-3 rounded-lg border border-gray-200 font-bold text-sm outline-none focus:border-[#92B061] transition-colors bg-white"
          >
            <option value="ALL">Tous les utilisateurs</option>
            {currentUser?.role === 'SUPERADMIN' ? (
              <>
                <option value="ADMIN">Administrateurs</option>
                <option value="CLIENT">Clients</option>
                <option value="SUPERADMIN">Super Admins</option>
              </>
            ) : (
              <>
                <option value="ACTIVE">Actifs</option>
                <option value="INACTIVE">Désactivés</option>
              </>
            )}
          </select>
          <button className="px-4 py-3 bg-white border border-gray-200 rounded-lg font-bold text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} /> Exporter
          </button>
        </div>
      </div>

      <UserTable 
        users={filteredUsers} 
        onToggleActive={handleToggleActive} 
        onView={(user) => setDetailUser(user)} 
        onEdit={(user) => { setActiveUser(user); setShowEditModal(true); }} 
      />

      <UserFormModal 
        isOpen={showAddModal || showEditModal} 
        isAddMode={showAddModal} 
        user={showAddModal ? newUser : activeUser} 
        onClose={() => { setShowAddModal(false); setShowEditModal(false); }} 
        onSubmit={showAddModal ? handleAddUser : handleUpdateUser} 
        onChange={(key, value) => showAddModal ? setNewUser(prev => ({ ...prev, [key]: value })) : setActiveUser(prev => ({ ...prev, [key]: value }))} 
      />

      <UserDetailModal 
        isOpen={Boolean(detailUser)} 
        user={detailUser} 
        onClose={() => setDetailUser(null)} 
        onEdit={() => { setActiveUser(detailUser); setDetailUser(null); setShowEditModal(true); }} 
      />
    </div>
  );
};

export default UserManagementPage;
