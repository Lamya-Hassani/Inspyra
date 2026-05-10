import React, { useState } from 'react';
import { 
  LayoutDashboard, Leaf, Users, ShoppingCart, 
  Settings, LogOut, Menu, X, Bell, Tag, Sparkles
} from 'lucide-react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
    { icon: Leaf, label: 'Gestion Plantes', path: '/admin/plants' },
    { icon: Tag, label: 'Catégories', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Sparkles, label: 'Préférences', path: '/admin/preferences' },
  ];

  const sidebarClass = isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0';

  return (
    <div className="flex h-screen bg-[#f8faf8] font-sans">
      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 ${sidebarClass} shadow-xl lg:shadow-none`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1 group">
              <div className="w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="I" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-[#274d00] tracking-tighter">NSPYRA</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Menu Principal</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
                  ${isActive 
                    ? 'bg-[#274d00] text-white shadow-lg shadow-green-100' 
                    : 'text-gray-500 hover:bg-purple-50 hover:text-[#6D58C7]'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-50 space-y-2">
            <Link 
              to="/admin/profile"
              className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Settings size={18} /> Paramètres
            </Link>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Panel de Gestion</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-gray-400 hover:text-[#6D58C7] hover:bg-purple-50 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#6D58C7] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-100"></div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{user?.username || 'Admin'}</p>
                <p className="text-[9px] text-[#6D58C7] font-black uppercase tracking-[0.15em] mt-0.5">{user?.role || 'Moderator'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'Admin'}`} alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
