import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { User, Package, Settings, LogOut, ChevronRight, Calendar, Sparkles, Leaf, Mail, Shield, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getHistory();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const tabs = [
    { id: 'orders', label: 'Mes Archives', icon: Package },
    { id: 'settings', label: 'Confidentialité', icon: Settings },
    { id: 'preferences', label: 'Style Botanique', icon: Leaf },
  ];

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-accent/20 text-accent border-accent/20';
      case 'SHIPPED': return 'bg-lavender/20 text-lavender border-lavender/20';
      default: return 'bg-primary/20 text-primary border-primary/20';
    }
  };

  return (
    <div className="relative min-h-screen max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-32 pt-12 overflow-hidden">
      {/* Decorative Premium Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-soft-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lavender/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20 relative z-10">

        {/* Sidebar - Editorial Style */}
        <aside className="lg:col-span-1 space-y-12">
          {/* User Profile Card */}
          <div className="glass-premium p-10 rounded-[3.5rem] border border-white/10 text-center space-y-8 relative overflow-hidden group shadow-3xl">
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-periwinkle border-8 border-white/20 shadow-2xl flex items-center justify-center text-primary relative z-10">
                <User size={56} strokeWidth={1} />
              </div>
              <button className="absolute bottom-1 right-1 p-3 bg-accent text-white rounded-2xl shadow-2xl hover:scale-110 transition-transform z-20">
                <Camera size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter">{user?.username || 'Curateur'}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">{user?.role || 'Membre Élite'}</p>
              </div>
            </div>
          </div>

          {/* Navigation - Minimalist */}
          <nav className="glass border border-white/10 rounded-[2.5rem] p-3 shadow-xl space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'text-white' : 'text-primary/50 dark:text-white/50 hover:text-accent'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="profile-tab"
                      className="absolute inset-0 bg-primary shadow-2xl rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-4">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-accent/60'} />
                    {tab.label}
                  </span>
                </button>
              );
            })}

            <div className="h-px bg-primary/5 my-4 mx-6" />

            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 transition-all text-left"
            >
              <LogOut size={16} /> Quitter la Session
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <h3 className="text-6xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-none">
                      Vos <br/> <span className="text-accent italic">Archives.</span>
                    </h3>
                  </div>
                  <span className="px-6 py-2.5 rounded-full glass border border-white/10 text-[9px] font-black uppercase text-primary/40 dark:text-white/40 tracking-[0.4em]">
                    {orders.length} Expéditions
                  </span>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-primary/5 rounded-[2.5rem] animate-pulse"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-premium p-24 rounded-[4rem] text-center space-y-10 shadow-3xl">
                    <div className="w-24 h-24 glass border border-white/10 rounded-full flex items-center justify-center mx-auto text-primary/10">
                      <Package size={48} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">Éden Vierge</h4>
                      <p className="text-primary/40 dark:text-white/40 font-medium italic max-w-sm mx-auto">Votre collection personnelle attend son premier spécimen.</p>
                    </div>
                    <Link to="/shop" className="inline-flex items-center gap-4 px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-accent transition-all">
                      Commencer l'immersion <ChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={order.id}
                        className="glass-premium p-8 sm:p-10 rounded-[3rem] border border-white/10 hover:border-accent/40 hover:shadow-3xl transition-all duration-700 group relative overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                          <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl glass border border-white/20 flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover:scale-105 transition-transform duration-700">
                              #{order.id}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Calendar size={14} className="text-accent" />
                                <span className="text-[10px] font-black text-primary/40 dark:text-white/40 uppercase tracking-[0.2em]">
                                  {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              </div>
                              <h4 className="font-black text-primary dark:text-white uppercase tracking-tight text-3xl">
                                {order.total} <span className="text-sm font-bold text-primary/30">MAD</span>
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border shadow-sm ${getStatusColor(order.statut)}`}>
                              {order.statut}
                            </span>
                            <button className="w-14 h-14 flex items-center justify-center glass rounded-2xl border border-white/10 text-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-2xl transition-all duration-700">
                              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <h3 className="text-6xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-none">
                    Profil <br/> <span className="text-accent italic">Élite.</span>
                  </h3>
                </div>

                <div className="glass-premium p-12 sm:p-20 rounded-[4rem] border border-white/10 shadow-3xl space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase text-accent tracking-[0.4em] flex items-center gap-3">
                        <User size={14} /> Curateur
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={user?.username}
                        className="w-full px-8 py-6 rounded-[2rem] glass border border-white/10 font-black text-primary dark:text-white text-xl outline-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase text-accent tracking-[0.4em] flex items-center gap-3">
                        <Mail size={14} /> Canal de Contact
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={`${user?.username?.toLowerCase().replace(/\s+/g, '')}@inspyra.com`}
                        className="w-full px-8 py-6 rounded-[2rem] glass border border-white/10 font-black text-primary dark:text-white text-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-12 border-t border-primary/5 space-y-8">
                    <div className="flex items-center gap-4">
                      <Shield className="text-accent" size={24} />
                      <h4 className="text-xs font-black uppercase text-primary dark:text-white tracking-[0.2em]">Sécurité du Domaine</h4>
                    </div>
                    <button className="px-12 py-6 glass border border-accent/20 text-accent rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-2xl">
                      Réinitialiser les Clés d'Accès
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <h3 className="text-6xl font-black text-primary dark:text-white uppercase tracking-[-0.04em] leading-none">
                    Studio <br/> <span className="text-accent italic">Botanique.</span>
                  </h3>
                </div>

                <div className="glass-premium p-20 lg:p-32 rounded-[5rem] text-center space-y-12 shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[120px] group-hover:scale-150 transition-transform duration-[2000ms] pointer-events-none"></div>

                  <div className="relative w-32 h-32 glass border border-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-accent shadow-3xl group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles size={56} className="animate-pulse" />
                  </div>

                  <div className="relative max-w-lg mx-auto space-y-6">
                    <h4 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">Architecturer votre Éden</h4>
                    <p className="text-primary/50 dark:text-white/50 font-medium leading-relaxed italic max-w-sm mx-auto">
                      Définissez votre profil environnemental pour une curation sur-mesure de vos futurs spécimens.
                    </p>
                  </div>

                  <Link
                    to="/plant-finder"
                    className="relative inline-flex items-center gap-4 px-14 py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-accent hover:-translate-y-2 transition-all group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-3">Initier le Diagnostique <ChevronRight size={18} /></span>
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;