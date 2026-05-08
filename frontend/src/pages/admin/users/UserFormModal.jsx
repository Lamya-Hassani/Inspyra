import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

const UserFormModal = ({ isOpen, isAddMode, user, onClose, onSubmit, onChange }) => {
  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl animate-fade-in" onClick={onClose}></div>
      <div className="glass w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 relative animate-float border border-white/20 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all z-10"><X /></button>
        <h3 className="text-xl sm:text-3xl font-black text-emerald-900 dark:text-white mb-6 sm:mb-8 tracking-tight">{isAddMode ? 'Nouveau Membre' : 'Modifier Membre'}</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Field label="Identifiant" required value={user.username} onChange={(v) => onChange('username', v)} className="sm:col-span-2" />
          <Field label="Email" type="email" required value={user.email} onChange={(v) => onChange('email', v)} />
          <Field label="Tel" value={user.telephone || ''} onChange={(v) => onChange('telephone', v)} />
          <Field label="Adresse" value={user.adresse || ''} onChange={(v) => onChange('adresse', v)} className="sm:col-span-2" />
          <Field label="Ville" value={user.ville || ''} onChange={(v) => onChange('ville', v)} />
          <Field label="Code Postal" value={user.codePostal || ''} onChange={(v) => onChange('codePostal', v)} />
          <Field 
            label="Mot de passe" 
            type="password" 
            placeholder={isAddMode ? "Requis" : "Laisser vide pour ne pas changer"}
            value={user.password || ''} 
            onChange={(v) => onChange('password', v)} 
            required={isAddMode}
          />
          <Field 
            label="Confirmer" 
            type="password" 
            placeholder={isAddMode ? "Requis" : "Laisser vide"}
            value={user.confirmPassword || ''} 
            onChange={(v) => onChange('confirmPassword', v)} 
            required={isAddMode && user.password}
          />
          <div className="sm:col-span-2">
            <Label>Role</Label>
            <select value={user.role || 'CLIENT'} onChange={(e) => onChange('role', e.target.value)} className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-[1rem] sm:rounded-2xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-sm">
              <option value="CLIENT">Client</option><option value="ADMIN">Admin</option><option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>
          <button className="sm:col-span-2 mt-4 py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"><Check size={18} />{isAddMode ? 'Creer le compte' : 'Enregistrer'}</button>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Label = ({ children }) => <label className="block text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest pl-1">{children}</label>;
const Field = ({ label, className = '', onChange, ...props }) => <div className={className}><Label>{label}</Label><input {...props} onChange={(e) => onChange(e.target.value)} className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-[1rem] sm:rounded-2xl bg-white/40 dark:bg-black/20 border border-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-sm" /></div>;

export default UserFormModal;
