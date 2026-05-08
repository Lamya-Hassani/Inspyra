import React, { useState } from 'react';
import { 
  LayoutDashboard, Leaf, Users, ShoppingCart, 
  Settings, LogOut, Menu, X, Bell, Sun, Moon, Search
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Leaf, label: 'Plantes', path: '/admin/plants' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
  ];

  return (
    <div className={`h-screen overflow-hidden flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 dark:from-emerald-950 dark:via-slate-950 dark:to-emerald-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[45] lg:hidden transition-all animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] glass border-r border-white/10 transition-all duration-500 ease-out shadow-2xl shadow-emerald-900/10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Inspyra Logo" 
                className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20 object-contain bg-white dark:bg-emerald-900/20"
              />
              <h1 className="text-2xl font-black tracking-tight text-emerald-900 dark:text-emerald-50">
                INS<span className="text-emerald-500">PYRA</span>
              </h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-emerald-900 dark:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 dark:text-emerald-100/40 mb-3 px-2">
              Navigation Admin
            </p>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'text-emerald-800/60 dark:text-emerald-100/40 hover:bg-emerald-500/5 hover:text-emerald-600'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-emerald-800/60 dark:text-emerald-100/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-bold text-sm">Paramètres</span>
            </button>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative h-full">
        {/* HEADER */}
        <header className="h-20 glass border-b border-white/10 px-4 md:px-8 flex items-center justify-between z-40 shrink-0 backdrop-blur-xl">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-emerald-500/10 rounded-xl text-emerald-600"
            >
              <Menu size={24} />
            </button>
            
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
              <input 
                type="text" 
                placeholder="Rechercher une plante, une commande..."
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white/30 dark:bg-emerald-900/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 md:p-2.5 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-white/20 hover:scale-110 transition-all"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-emerald-600" />}
            </button>
            <div className="relative">
              <button className="p-2 md:p-2.5 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-white/20 hover:scale-110 transition-all">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="h-8 w-px bg-white/20 mx-1 md:mx-2"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => navigate('/admin/profile')}>
              <div className="text-right hidden xl:block">
                <p className="text-xs font-black text-emerald-900 dark:text-white uppercase leading-none">{user?.username || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">{user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800 border-2 border-emerald-500/20 overflow-hidden group-hover:scale-105 transition-all shadow-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-4 md:p-6 lg:p-10 overflow-y-auto custom-scrollbar flex-1 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
