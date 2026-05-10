import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, LogOut, Leaf } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/shop' },
    { name: 'Plant Finder', path: '/plant-finder' },
    { name: 'Support', path: '/support' },
  ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navClass = isScrolled 
    ? 'bg-white shadow-sm border-b border-gray-100 py-4' 
    : 'bg-white/80 backdrop-blur-sm py-6';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="I" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#274d00]">
            NSPYRA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-[#6D58C7] ${isActive(link.path) ? 'text-[#274d00] border-b-2 border-[#6D58C7] pb-1' : 'text-gray-500'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Link to="/wishlist" className="relative text-gray-500 hover:text-[#6D58C7] transition-colors">
            <Heart size={20} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="relative text-gray-500 hover:text-[#6D58C7] transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#6D58C7] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            {isAuthenticated ? (
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-xl border border-green-100 text-[#274d00] hover:bg-purple-50 hover:border-purple-100 hover:text-[#6D58C7] transition-all"
              >
                <User size={18} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">{user.username}</span>
              </button>
            ) : (
              <Link to="/login" className="text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border-2 border-[#274d00] text-[#274d00] hover:bg-[#274d00] hover:text-white transition-all shadow-sm">
                Connexion
              </Link>
            )}
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden ring-1 ring-black/5">
                <Link to="/profile" className="block px-6 py-3 text-xs font-bold text-gray-600 hover:bg-purple-50 hover:text-[#6D58C7] transition-colors uppercase tracking-widest">Mon profil</Link>
                {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                  <Link to="/admin" className="block px-6 py-3 text-xs font-black text-[#274d00] hover:bg-green-50 transition-colors uppercase tracking-widest border-t border-gray-50">Administration</Link>
                )}
                <button 
                  onClick={logout} 
                  className="w-full text-left px-6 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2 uppercase tracking-widest border-t border-gray-50"
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#274d00]">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-6 flex flex-col gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`text-sm font-black uppercase tracking-widest ${isActive(link.path) ? 'text-[#274d00]' : 'text-gray-500'}`}>
              {link.name}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" className="bg-[#274d00] text-white text-center py-4 rounded-xl font-black uppercase tracking-widest">Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;