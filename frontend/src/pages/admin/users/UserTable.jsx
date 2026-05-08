import React from 'react';
import { Shield, UserCheck, UserX, Eye, Edit2 } from 'lucide-react';

const UserTable = ({ users, onToggleActive, onView, onEdit }) => (
  <div className="glass overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead><tr className="bg-emerald-500/5 text-emerald-800/40 dark:text-emerald-100/40 text-[9px] sm:text-[10px] uppercase font-black tracking-[0.2em]"><th className="px-6 sm:px-8 py-5 sm:py-6">Membre</th><th className="px-6 sm:px-8 py-5 sm:py-6">Role</th><th className="px-6 sm:px-8 py-5 sm:py-6">Contact</th><th className="px-6 sm:px-8 py-5 sm:py-6">Status</th><th className="px-6 sm:px-8 py-5 sm:py-6 text-center">Actions</th></tr></thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => {
            const isActive = user.is_active !== false;
            return (
              <tr key={user.id} className={`transition-all group ${isActive ? 'hover:bg-emerald-500/5' : 'bg-rose-500/5 opacity-70'}`}>
                <td className="px-6 sm:px-8 py-4 sm:py-6"><div className="flex items-center gap-3"><div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden border-2 border-white shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className={isActive ? '' : 'grayscale'} /></div><div className="min-w-0"><p className="text-xs sm:text-sm font-black text-emerald-900 dark:text-white uppercase leading-none mb-1 truncate">{user.username}</p><p className="text-[9px] sm:text-[10px] font-bold text-emerald-500 tracking-tight lowercase truncate">{user.email}</p></div></div></td>
                <td className="px-6 sm:px-8 py-4 sm:py-6"><div className="flex items-center gap-2 text-emerald-950 dark:text-white"><Shield size={12} className={user.role === 'ADMIN' ? 'text-emerald-500' : 'text-blue-500'} /><span className="text-[10px] sm:text-xs font-black uppercase tracking-tighter">{user.role}</span></div></td>
                <td className="px-6 sm:px-8 py-4 sm:py-6"><p className="text-[10px] sm:text-xs font-bold text-emerald-900 dark:text-white">{user.telephone || 'Non renseigne'}</p><p className="text-[9px] sm:text-[10px] opacity-40 uppercase font-black">{user.ville || 'Inconnue'}</p></td>
                <td className="px-6 sm:px-8 py-4 sm:py-6"><span className={`text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-widest ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'}`}>{isActive ? 'Actif' : 'Desactive'}</span></td>
                <td className="px-8 py-6"><div className="flex items-center justify-center gap-2"><button onClick={() => onToggleActive(user.id, isActive)} className={`p-2.5 rounded-xl transition-all ${isActive ? 'text-amber-500 hover:bg-amber-500 hover:text-white' : 'text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>{isActive ? <UserX size={18} /> : <UserCheck size={18} />}</button><button onClick={() => onView(user)} className="p-2.5 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-emerald-600"><Eye size={18} /></button><button onClick={() => onEdit(user)} className="p-2.5 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-emerald-600"><Edit2 size={18} /></button></div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
