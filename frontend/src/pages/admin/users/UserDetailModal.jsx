import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield } from 'lucide-react';

const UserDetailModal = ({ isOpen, user, onClose, onEdit }) => {
  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden mb-4">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="avatar" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{user.username}</h3>
          <p className="text-[#92B061] font-bold text-sm lowercase">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <InfoCard label="Téléphone" value={user.telephone || '-'} />
          <InfoCard label="Rôle Système" value={user.role} icon={<Shield size={14} className="text-[#92B061]" />} />
          <div className="sm:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Localisation</p>
            <p className="text-gray-900 font-bold text-sm">{user.adresse || '-'}</p>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">{user.ville} {user.codePostal}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onEdit} className="flex-1 py-3 bg-[#274d00] text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-colors hover:bg-[#1e3b00] shadow-lg">Modifier</button>
          <button onClick={onClose} className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors">Fermer</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">{icon}{value}</div>
  </div>
);

export default UserDetailModal;
