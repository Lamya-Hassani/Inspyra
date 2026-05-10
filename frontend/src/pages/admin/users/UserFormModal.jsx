import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

const UserFormModal = ({ isOpen, isAddMode, user, onClose, onSubmit, onChange }) => {
  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
        
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">{isAddMode ? 'Ajouter un membre' : 'Modifier le membre'}</h3>
          <p className="text-sm text-gray-500">Gérez les accès et les informations du compte.</p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Identifiant</Label>
            <input 
              type="text" 
              required 
              value={user.username} 
              onChange={(e) => onChange('username', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-1">
            <Label>Email</Label>
            <input 
              type="email" 
              required 
              value={user.email} 
              onChange={(e) => onChange('email', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-1">
            <Label>Téléphone</Label>
            <input 
              type="text" 
              value={user.telephone || ''} 
              onChange={(e) => onChange('telephone', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Adresse</Label>
            <input 
              type="text" 
              value={user.adresse || ''} 
              onChange={(e) => onChange('adresse', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div>
            <Label>Ville</Label>
            <input 
              type="text" 
              value={user.ville || ''} 
              onChange={(e) => onChange('ville', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div>
            <Label>Code Postal</Label>
            <input 
              type="text" 
              value={user.codePostal || ''} 
              onChange={(e) => onChange('codePostal', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-1">
            <Label>Mot de passe</Label>
            <input 
              type="password" 
              placeholder={isAddMode ? "Requis" : "Laisser vide"}
              value={user.password || ''} 
              onChange={(e) => onChange('password', e.target.value)} 
              required={isAddMode}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-1">
            <Label>Confirmer</Label>
            <input 
              type="password" 
              placeholder={isAddMode ? "Requis" : "Confirmer"}
              value={user.confirmPassword || ''} 
              onChange={(e) => onChange('confirmPassword', e.target.value)} 
              required={isAddMode && user.password}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Rôle</Label>
            <select 
              value={user.role || 'CLIENT'} 
              onChange={(e) => onChange('role', e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#92B061] font-bold text-sm bg-white"
            >
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Administrateur</option>
              <option value="SUPERADMIN">Super Administrateur</option>
            </select>
          </div>

          <button className="md:col-span-2 mt-4 py-4 bg-[#274d00] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1e3b00] transition-colors shadow-lg">
            <Check size={20} />
            {isAddMode ? 'Créer le compte' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Label = ({ children }) => <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{children}</label>;

export default UserFormModal;
