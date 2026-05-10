import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Shield, Truck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import productService from '../services/productService';

/* ─────────────────────────────────────────────
   SECTION: HERO
───────────────────────────────────────────── */
const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center px-6 bg-gray-900">
      <div className="absolute inset-0">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-60"
          src="/bg-vid.mp4"
        />
      </div>

      <div className="relative z-10 text-white max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-6 bg-white/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
            Botanique d'Exception
          </span>
          <div className="h-px w-6 bg-white/40" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Respirer L'Éden
        </h1>

        <p className="text-lg md:text-xl font-medium text-white/80 mb-10 italic">
          "Chaque plante, une rencontre."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-[#274d00] text-white font-bold text-sm rounded-xl hover:bg-[#1a3400] transition-colors shadow-lg"
          >
            Explorer la Collection
          </Link>
          <Link
            to="/plant-finder"
            className="px-8 py-3.5 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-white hover:text-gray-900 transition-colors"
          >
            Trouver ma plante
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION: TRUST BAR
───────────────────────────────────────────── */
const TrustBar = () => (
  <section className="bg-white py-12 px-6 border-b border-gray-100">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { icon: <Truck size={20} />, title: 'Livraison', sub: 'Partout au Maroc' },
        { icon: <Shield size={20} />, title: 'Garantie', sub: '30 jours vitalité' },
        { icon: <Leaf size={20} />, title: 'Éco-Green', sub: 'Zéro plastique' },
        { icon: <Sparkles size={20} />, title: 'Conseils', sub: 'Expertise 7j/7' },
      ].map(({ icon, title, sub }) => (
        <div key={title} className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#274d00] mb-3">
            {icon}
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">{title}</h4>
          <p className="text-xs font-medium text-gray-500 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: FEATURED
───────────────────────────────────────────── */
const FeaturedProducts = ({ products }) => (
  <section className="py-20 px-6 bg-[#f8faf8]">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-1 bg-[#6D58C7] rounded-full"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">La Sélection</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#274d00] tracking-tight">Nos Best-sellers</h2>
        </div>
        <Link
          to="/shop"
          className="text-sm font-bold text-[#274d00] hover:text-[#6D58C7] transition-colors flex items-center gap-2"
        >
          Voir le catalogue <ArrowRight size={16} />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/5] rounded-2xl bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: RECOMMENDATION
───────────────────────────────────────────── */
const RecommendationShowcase = () => (
  <section className="py-24 px-6 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-1 bg-[#6D58C7] rounded-full"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Intelligence Botanique</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#274d00] tracking-tight mb-6">
          Votre plante idéale, <br />
          <span className="text-[#6D58C7]">trouvée par algorithme.</span>
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          Fini les devinettes. Remplissez votre profil botanique en quelques clics et notre système de recommandation intelligent analysera votre environnement (lumière, animaux, humidité) pour vous proposer les plantes parfaites pour vous.
        </p>
        
        <ul className="space-y-4 mb-10">
          {[
            'Analyse de l\'environnement (Luminosité, humidité)',
            'Prise en compte du niveau d\'expertise',
            'Sécurité garantie (Plantes pet-friendly)'
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#274d00]">
              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[#6D58C7]">
                <Sparkles size={12} />
              </div>
              {item}
            </li>
          ))}
        </ul>

        <Link
          to="/plant-finder"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#274d00] text-white font-bold text-sm rounded-xl hover:bg-[#5a48a7] transition-all shadow-lg shadow-purple-200"
        >
          Lancer le Plant Finder <ArrowRight size={18} />
        </Link>
      </div>
      <div className="flex-1 relative w-full">
        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b"
            alt="Plant Finder Algorithm" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-green-50 rounded-full blur-[60px] -z-10"></div>
        <div className="absolute -top-8 -right-8 w-64 h-64 bg-purple-50 rounded-full blur-[60px] -z-10"></div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: FINAL CTA
───────────────────────────────────────────── */
const FinalCta = () => (
  <section className="py-24 px-6 bg-[#f0e6ff] overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/40 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3"></div>
    
    <div className="max-w-3xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-bold text-[#6D58C7] mb-6 leading-tight">
        Prêt à verdir votre intérieur ?
      </h2>
      <p className="text-lg text-[#274d00]/70 mb-10 italic font-medium">
        "Rejoignez plus de 12 000 passionnés qui ont transformé leur quotidien avec nous."
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/shop"
          className="px-10 py-3.5 bg-[#6D58C7] text-white font-bold text-sm rounded-xl hover:bg-[#5a48a7] transition-colors shadow-lg shadow-purple-200"
        >
          Commander maintenant
        </Link>
        <Link
          to="/support"
          className="px-10 py-3.5 border-2 border-[#6D58C7] text-[#6D58C7] font-bold text-sm rounded-xl hover:bg-[#6D58C7] hover:text-white transition-colors"
        >
          Contacter un expert
        </Link>
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getPlants({ ordering: '-created_at', page_size: 4 })
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustBar />
      <FeaturedProducts products={products} />
      <RecommendationShowcase />
      <FinalCta />
    </div>
  );
};

export default LandingPage;