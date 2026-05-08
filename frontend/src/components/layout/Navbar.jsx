import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf, Heart, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('inspyra_theme') === 'dark' ||
        (!('inspyra_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    setIsScrolled(window.scrollY > 20);
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('inspyra_theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('inspyra_theme', 'light'); }
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  useEffect(() => {

  }, []);


  useEffect(() => { setIsMobileMenuOpen(false); setIsProfileOpen(false); }, [location]);

  const navLinks = [
    { name: 'Éden', path: '/' },
    { name: 'Bibliothèque', path: '/shop' },
    { name: 'Curation', path: '/plant-finder' },
    { name: 'Archives', path: '/profile' },
  ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // When over hero video (not scrolled): links are on top of dark video
  // When scrolled: links are on white/light background
  // Active = forest green bg + white text (always visible on both)
  // Inactive on video = semi-transparent white text
  // Inactive on white bg = muted forest green text
  const getLinkClass = (path) => {
    const active = isActive(path);
    if (active) {
      // Active: always forest green pill — readable on both video and white bg
      return isScrolled
        ? 'bg-[#274d00] text-white shadow-md shadow-[#274d00]/20'
        : 'bg-[#274d00]/80 text-white shadow-md backdrop-blur-sm';
    }
    // Inactive
    return isScrolled
      ? 'text-[#274d00]/55 hover:text-[#274d00] hover:bg-[#274d00]/6'
      : 'text-white/65 hover:text-white hover:bg-white/12';
  };

  const iconClass = isScrolled
    ? 'text-[#274d00]/45 hover:text-[#274d00] hover:bg-[#274d00]/6'
    : 'text-white/65 hover:text-white hover:bg-white/12';

  const borderBtnClass = isScrolled
    ? 'bg-[#274d00]/5 border-[#274d00]/12 text-[#274d00] hover:bg-[#274d00]/10'
    : 'bg-white/8 border-white/20 text-white hover:bg-white/15';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'py-3 bg-white/92 dark:bg-black/88 backdrop-blur-xl shadow-sm border-b border-[#274d00]/6 dark:border-white/8'
        : 'py-6 bg-transparent'
      }`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className={`w-9 h-9 rounded-xl overflow-hidden border border-white/30 shadow-md transition-all ${isScrolled ? 'scale-90' : 'scale-100'}`}>
            <img src="/logo.png" alt="Inspyra" className="w-full h-full object-cover" />
          </div>
          <span className={`text-[15px] font-bold tracking-wide transition-all ${isScrolled ? 'text-[#274d00] dark:text-white' : 'text-white drop-shadow'}`}>
            INS<span className="text-[#92B061]">PYRA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.16em] transition-all duration-300 ${getLinkClass(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wishlist */}
          <Link to="/wishlist" className={`relative p-2.5 rounded-xl transition-all ${iconClass}`}>
            <Heart size={17} className={wishlist.length > 0 ? 'fill-[#92B061] text-[#92B061]' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#92B061] rounded-full animate-pulse" />
            )}
          </Link>

          {/* Theme */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl transition-all hover:rotate-12 ${iconClass}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-xl border shadow-sm transition-all hover:scale-105 ${borderBtnClass}`}
          >
            <ShoppingCart size={17} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#92B061] text-white text-[9px] rounded-full flex items-center justify-center font-black shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User */}
          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-sm transition-all hover:scale-[1.02] ${borderBtnClass}`}
                >
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-wider">{user.username}</span>
                  <div className="w-6 h-6 rounded-full bg-[#274d00] text-white flex items-center justify-center">
                    <User size={12} />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-[#0d1a06] rounded-2xl shadow-2xl border border-[#274d00]/8 dark:border-white/8 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-[#274d00]/6 dark:border-white/6 bg-[#274d00]/3">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#92B061]">Connecté</p>
                        <p className="font-black text-[#274d00] dark:text-white truncate mt-0.5 text-sm">{user.username}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#274d00]/70 dark:text-white/70 hover:bg-[#274d00]/5 hover:text-[#274d00] dark:hover:text-white transition-all w-full">
                          <Leaf size={13} className="text-[#92B061]" /> Archives
                        </Link>
                        {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#274d00]/70 dark:text-white/70 hover:bg-[#274d00]/5 hover:text-[#274d00] dark:hover:text-white transition-all w-full">
                            <Leaf size={13} className="text-[#92B061]" /> Management
                          </Link>
                        )}
                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/8 transition-all">
                          <LogOut size={13} /> Quitter
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:flex items-center px-5 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-md ${isScrolled
                    ? 'bg-[#274d00] text-white hover:bg-[#92B061]'
                    : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
                  }`}
              >
                Identification
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border shadow-sm transition-all ${borderBtnClass}`}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/96 dark:bg-[#050a00]/96 backdrop-blur-xl border-t border-[#274d00]/6 shadow-xl"
          >
            <div className="p-5 flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${active ? 'bg-[#274d00] text-white shadow-md' : 'text-[#274d00]/55 dark:text-white/55 hover:bg-[#274d00]/5 hover:text-[#274d00] dark:hover:text-white'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <Link to="/login" className="w-full py-3.5 mt-2 rounded-xl bg-[#274d00] text-white font-black tracking-[0.2em] text-xs uppercase text-center shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Identification
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;