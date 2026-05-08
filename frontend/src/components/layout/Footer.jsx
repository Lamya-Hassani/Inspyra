import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin, Phone, Globe, Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 glass pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="Inspyra Logo" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20 object-contain bg-white dark:bg-emerald-900/20"
            />
            <span className="text-xl font-black tracking-tighter text-emerald-950 dark:text-white uppercase">Inspyra</span>
          </Link>
          <p className="text-sm font-medium text-emerald-900/50 dark:text-emerald-100/50 leading-relaxed max-w-xs">
            Transformez votre espace avec l'élégance de la nature. Nous livrons les plus belles plantes directement chez vous, avec amour et expertise.
          </p>
          <div className="flex items-center gap-4">
            {[MessageCircle, Share2, Globe].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-emerald-600 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-4">
            {['Boutique', 'Nouveaux Arrivages', 'Promotions', 'Entretien des plantes'].map((item) => (
              <li key={item}>
                <Link to="/shop" className="text-sm font-bold text-emerald-900/60 dark:text-emerald-100/60 hover:text-emerald-600 transition-colors uppercase tracking-tight">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-6">Support</h4>
          <ul className="space-y-4">
            <li><Link to="/profile" className="text-sm font-bold text-emerald-900/60 dark:text-emerald-100/60 hover:text-emerald-600 transition-colors uppercase tracking-tight">Ma Commande</Link></li>
            <li><a href="#" className="text-sm font-bold text-emerald-900/60 dark:text-emerald-100/60 hover:text-emerald-600 transition-colors uppercase tracking-tight">Conditions Générales</a></li>
            <li><a href="#" className="text-sm font-bold text-emerald-900/60 dark:text-emerald-100/60 hover:text-emerald-600 transition-colors uppercase tracking-tight">Politique de Confidentialité</a></li>
            <li><Link to="/support" className="text-sm font-bold text-emerald-900/60 dark:text-emerald-100/60 hover:text-emerald-600 transition-colors uppercase tracking-tight">Support</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="glass rounded-[2rem] p-6 border border-white/20">
          <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-6">Contactez-nous</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-bold text-emerald-950 dark:text-white">Grand Boulevard de l'Emsi, Casablanca, Maroc</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-bold text-emerald-950 dark:text-white">+212 522 00 00 00</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-bold text-emerald-950 dark:text-white">hello@inspyra.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/30 dark:text-emerald-100/30">
          © {new Date().getFullYear()} INSPYRA | Powered by Emsi 6
        </p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-6 bg-white/40 rounded border border-white/20"></div>
          <div className="w-10 h-6 bg-white/40 rounded border border-white/20"></div>
          <div className="w-10 h-6 bg-white/40 rounded border border-white/20"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
