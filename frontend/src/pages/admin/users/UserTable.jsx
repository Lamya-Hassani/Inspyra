import React from 'react';
import { Shield, UserCheck, UserX, Eye, Edit2 } from 'lucide-react';

const UserTable = ({ users, onToggleActive, onView, onEdit }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <th className="px-6 py-4">Utilisateur</th>
            <th className="px-6 py-4">Rôle</th>
            <th className="px-6 py-4">Ville</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const isActive = user.is_active !== false;
            return (
              <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${!isActive ? 'opacity-60 bg-red-50/30' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="avatar" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                      <p className="text-xs text-gray-400 truncate lowercase">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className={user.role === 'ADMIN' ? 'text-blue-500' : 'text-[#92B061]'} />
                    <span className="text-xs font-bold text-gray-700">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-gray-700">{user.ville || '-'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{user.telephone || ''}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    isActive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => onToggleActive(user.id, isActive)} 
                      className={`p-2 rounded-lg transition-colors ${isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                      title={isActive ? "Désactiver" : "Activer"}
                    >
                      {isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                    <button 
                      onClick={() => onView(user)} 
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Voir"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(user)} 
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
