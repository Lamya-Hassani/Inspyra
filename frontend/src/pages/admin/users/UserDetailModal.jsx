import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield } from 'lucide-react';

const UserDetailModal = ({ isOpen, user, onClose, onEdit }) => {
  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl animate-fade-in" onClick={onClose}></div>
      <div className="glass w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 relative animate-float border border-white/20 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-10 sm:right-10 p-2 sm:p-3 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all"><X /></button>
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 pt-4 sm:pt-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-emerald-100 to-emerald-200 border-4 border-white shadow-xl overflow-hidden mb-4">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-emerald-900 dark:text-white uppercase tracking-tight truncate w-full px-4">{user.username}</h3>
          <p className="text-emerald-500 font-bold text-xs sm:text-sm truncate w-full px-4">{user.email}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 text-left">
          <InfoCard label="Telephone" value={user.telephone || 'Non renseigne'} />
          <InfoCard label="Role Systeme" value={user.role} icon={<Shield size={12} className="text-emerald-500" />} />
          <div className="sm:col-span-2 glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10"><p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">Localisation</p><p className="text-emerald-900 dark:text-white font-bold text-sm leading-tight">{user.adresse || 'N/A'}</p><p className="text-[10px] sm:text-xs font-medium opacity-60 italic mt-1">{user.ville}, {user.codePostal}, {user.pays}</p></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onEdit} className="w-full sm:flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-emerald-500 shadow-xl shadow-emerald-600/20">Modifier</button>
          <button onClick={onClose} className="w-full sm:px-8 py-4 glass rounded-2xl font-black uppercase tracking-widest text-[10px] text-emerald-900 dark:text-white border border-white/20">Fermer</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10">
    <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-2 text-emerald-900 dark:text-white">{icon}<span className="font-black uppercase text-sm">{value}</span></div>
  </div>
);

export default UserDetailModal;
