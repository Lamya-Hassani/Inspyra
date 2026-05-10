import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-50 border-t border-gray-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#274d00] rounded-lg flex items-center justify-center text-white font-bold">I</div>
            <span className="text-xl font-bold tracking-tight text-[#274d00]">INSPYRA</span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Embellissez votre quotidien avec notre sélection de plantes d'exception. Livraison partout au Maroc.
          </p>
          <div className="flex items-center gap-3">
            {[MessageCircle, Share2, Globe].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#92B061] transition-colors shadow-sm">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Navigation</h4>
          <ul className="space-y-3">
            {['Boutique', 'Nouveautés', 'Promotions', 'Entretien'].map((item) => (
              <li key={item}>
                <Link to="/shop" className="text-sm text-gray-500 hover:text-[#274d00] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Aide</h4>
          <ul className="space-y-3">
            <li><Link to="/profile" className="text-sm text-gray-500 hover:text-[#274d00] transition-colors">Ma Commande</Link></li>
            <li><Link to="/support" className="text-sm text-gray-500 hover:text-[#274d00] transition-colors">Support</Link></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-[#274d00] transition-colors">Conditions de vente</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#92B061] shrink-0" />
              <p className="text-sm text-gray-500">Grand Boulevard de l'Emsi, Casablanca</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#92B061] shrink-0" />
              <p className="text-sm text-gray-500">+212 522 00 00 00</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#92B061] shrink-0" />
              <p className="text-sm text-gray-500">hello@inspyra.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} INSPYRA. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4 grayscale opacity-50">
          {/* Payment icons placeholder */}
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
          <div className="w-10 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
