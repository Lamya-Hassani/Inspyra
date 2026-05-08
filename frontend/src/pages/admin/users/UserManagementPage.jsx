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
      toast.success('Membre ajouté avec succès');
    } catch (error) {
      toast.error(error.response?.data?.username?.[0] || 'Erreur lors de l\'ajout');
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (activeUser.password && activeUser.password !== activeUser.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }
    
    try {
      // Create a copy without confirmPassword for the API
      const { confirmPassword, ...updateData } = activeUser;
      // Remove password if empty to not overwrite it with empty string
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

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-white tracking-tight leading-tight">Gestion des <span className="text-gradient">Membres</span></h2>
          <p className="text-xs sm:text-sm text-emerald-800/50 dark:text-emerald-100/50 font-medium mt-1">Administrez les roles et les acces de votre communaute.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 text-sm"><UserPlus size={18} />Ajouter un Membre</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40" /><input type="text" placeholder="Rechercher par nom ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full glass pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all border border-white/10" /></div>
        <div className="flex gap-4"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="glass px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-emerald-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border border-white/10"><option value="ALL">Tous les Filtres</option>{currentUser?.role === 'SUPERADMIN' ? <><option value="ADMIN">Admins Uniquement</option><option value="CLIENT">Clients Uniquement</option><option value="SUPERADMIN">Super Admins</option></> : <><option value="ACTIVE">Actifs Uniquement</option><option value="INACTIVE">Desactives Uniquement</option></>}</select><button className="glass px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-emerald-900 dark:text-white hover:bg-white/40 transition-all flex items-center gap-2 border border-white/10"><Download size={16} />Exporter</button></div>
      </div>

      <UserTable users={filteredUsers} onToggleActive={handleToggleActive} onView={(user) => setDetailUser(user)} onEdit={(user) => { setActiveUser(user); setShowEditModal(true); }} />
      <UserFormModal isOpen={showAddModal || showEditModal} isAddMode={showAddModal} user={showAddModal ? newUser : activeUser} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} onSubmit={showAddModal ? handleAddUser : handleUpdateUser} onChange={(key, value) => showAddModal ? setNewUser((prev) => ({ ...prev, [key]: value })) : setActiveUser((prev) => ({ ...prev, [key]: value }))} />
      <UserDetailModal isOpen={Boolean(detailUser)} user={detailUser} onClose={() => setDetailUser(null)} onEdit={() => { setActiveUser(detailUser); setDetailUser(null); setShowEditModal(true); }} />
    </div>
  );
};

const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-600">
    <Loader2 className="w-12 h-12 animate-spin" />
    <p className="font-black uppercase tracking-widest text-sm">Chargement des membres...</p>
  </div>
);

export default UserManagementPage;
