import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, ChevronDown, Star, Package, Shield, Truck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import productService from '../services/productService';

/* ─────────────────────────────────────────────
   SECTION: CINEMATIC HERO  (full-screen)
───────────────────────────────────────────── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden">
      {/* Parallax video/bg */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          src="/bg-vid.mp4"
        />
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/15" />
      </motion.div>

      {/* Floating ambient particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-white/20 select-none"
          style={{
            left: `${12 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            fontSize: `${1.2 + (i % 3) * 0.6}rem`,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, i % 2 === 0 ? 12 : -10, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        >
          {['✦', '◌', '·', '✦', '◌', '·'][i]}
        </motion.div>
      ))}

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center"
      >
        {/* Pre-headline label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px w-12 bg-white/50" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
            Botanique d'Exception
          </span>
          <div className="h-px w-12 bg-white/50" />
        </motion.div>

        {/* Main title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(72px,12vw,160px)] leading-[0.88] tracking-[-0.03em] font-serif"
          >
            Respirer
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(72px,12vw,160px)] leading-[0.88] tracking-[-0.03em] font-serif italic"
            style={{ color: 'rgba(255,255,255,0.92)' }}
          >
            L'Éden
          </motion.h1>
        </div>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-[clamp(13px,1.5vw,17px)] font-light tracking-[0.35em] uppercase text-white/60 mb-14"
        >
          Chaque plante, une rencontre.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/shop"
            className="group flex items-center gap-3 px-10 py-4 bg-white text-[#274d00] font-black text-[11px] uppercase tracking-[0.25em] rounded-full hover:bg-[#92B061] hover:text-white transition-all duration-500 shadow-2xl shadow-black/30"
          >
            Explorer la Collection
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/plant-finder"
            className="flex items-center gap-3 px-10 py-4 border border-white/40 text-white font-light text-[11px] uppercase tracking-[0.25em] rounded-full hover:border-white/80 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
          >
            Trouver ma plante
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-10 sm:gap-16"
        >
          {[
            { num: '340+', label: 'Espèces rares' },
            { num: '12K', label: 'Clients satisfaits' },
            { num: '98%', label: 'Plantes vivantes' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white tracking-tight">{num}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Défiler</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION: MANIFESTO / NARRATIVE
───────────────────────────────────────────── */
const Manifesto = () => (
  <section className="py-40 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-10">Notre Philosophie</p>
        <h2 className="text-[clamp(36px,5vw,64px)] font-serif italic text-[#274d00] leading-[1.15] mb-10">
          "Nous cultivons la vie,<br /> pas seulement des produits."
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed font-light max-w-2xl mx-auto">
          Chez Inspyra, chaque plante est une rencontre. De notre sélection rigoureuse jusqu'à votre foyer,
          nous orchestrons une expérience de soin sur-mesure. Parce que votre espace mérite
          le calme, la pureté, et la force silencieuse du végétal.
        </p>
        <Link
          to="/shop"
          className="mt-14 inline-flex items-center gap-3 px-12 py-4 border border-[#274d00] text-[#274d00] uppercase text-[10px] tracking-[0.3em] font-black hover:bg-[#274d00] hover:text-white transition-all duration-500 rounded-full group"
        >
          Découvrir notre approche
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: TRUST / PROMISE BAR
───────────────────────────────────────────── */
const TrustBar = () => (
  <section className="border-y border-[#274d00]/10 bg-[#274d00]/[0.03] py-10 px-6">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { icon: <Truck size={22} />, title: 'Livraison soignée', sub: 'Emballage climatisé' },
        { icon: <Shield size={22} />, title: 'Garantie vitalité', sub: '30 jours garantis' },
        { icon: <Leaf size={22} />, title: 'Éco-certifié', sub: 'Zéro plastique' },
        { icon: <Star size={22} />, title: 'Experts botanistes', sub: 'Support 7j/7' },
      ].map(({ icon, title, sub }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#92B061]/10 border border-[#92B061]/20 flex items-center justify-center text-[#274d00]">
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#274d00]">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-light">{sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: FEATURED PRODUCTS
───────────────────────────────────────────── */
const FeaturedProducts = ({ products }) => (
  <section className="py-36 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-4">Sélection du moment</p>
          <h2 className="text-[clamp(34px,5vw,60px)] font-serif text-[#274d00] leading-tight">
            Espèces qui font<br /><span className="italic">tomber amoureux.</span>
          </h2>
        </div>
        <Link
          to="/shop"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-black text-[#274d00] hover:text-[#92B061] transition-colors group shrink-0"
        >
          Voir tout le catalogue
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Skeleton loaders */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-[3.5rem] bg-gray-100" />
              <div className="mt-6 h-3 bg-gray-100 rounded-full w-1/3" />
              <div className="mt-3 h-5 bg-gray-100 rounded-full w-3/4" />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: EDITORIAL SPLIT — EXCELLENCE
───────────────────────────────────────────── */
const EditorialExcellence = () => (
  <section className="py-24 bg-[#274d00]/[0.03] border-y border-[#274d00]/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="order-2 md:order-1"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-6">Notre Promesse</p>
        <h3 className="text-[clamp(32px,4.5vw,54px)] font-serif text-[#274d00] leading-tight mb-8">
          Une excellence<br /><span className="italic">cultivée à la racine.</span>
        </h3>
        <p className="text-gray-500 leading-relaxed font-light mb-6">
          Nos experts ne sont pas de simples vendeurs — ils sont vos partenaires en botanica.
          Chaque spécimen est inspecté pour garantir sa vitalité avant de rejoindre votre intérieur.
        </p>
        <p className="text-gray-500 leading-relaxed font-light mb-12">
          De la pépinière à votre salon, nous contrôlons chaque étape : sélection, conditionnement,
          transport climatisé, et suivi post-livraison. Rien n'est laissé au hasard.
        </p>
        <Link
          to="/support"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-black text-[#274d00] border-b border-[#274d00]/30 pb-1 hover:border-[#92B061] hover:text-[#92B061] transition-all group"
        >
          Notre processus
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="order-1 md:order-2"
      >
        <div className="relative">
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#274d00]/10 to-[#92B061]/10 border border-[#274d00]/10">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800"
              alt="Soin botanique"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating accent card */}
          <div className="glass absolute -bottom-6 -left-6 md:-left-10 p-6 rounded-[2rem] border border-white/60 max-w-[200px] shadow-xl">
            <div className="text-3xl font-black text-[#274d00] mb-1">98%</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-light">plantes reçues vivantes</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: CATEGORIES SHOWCASE
───────────────────────────────────────────── */
const categories = [
  { name: 'Intérieur', sub: '120+ espèces', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600', href: '/shop?cat=interieur' },
  { name: 'Succulentes', sub: '60+ espèces', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=600', href: '/shop?cat=succulentes' },
  { name: 'Rares & Exotiques', sub: '40+ espèces', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600', href: '/shop?cat=rares' },
];

const CategoriesShowcase = () => (
  <section className="py-36 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-4">Univers</p>
        <h2 className="text-[clamp(34px,5vw,58px)] font-serif text-[#274d00]">
          Trouvez votre <span className="italic">espace vert.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(({ name, sub, img, href }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.8 }}
          >
            <Link to={href} className="group block relative rounded-[2.5rem] overflow-hidden aspect-[3/4] md:aspect-[4/5]">
              <img
                src={img}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#274d00]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 font-light">{sub}</p>
                <h3 className="text-3xl font-serif text-white mb-4 leading-tight">{name}</h3>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/70 font-black translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Explorer <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: PLANT FINDER TEASER (SaaS feature)
───────────────────────────────────────────── */
const PlantFinderTeaser = () => (
  <section className="py-24 px-6 bg-[#274d00] overflow-hidden relative">
    {/* Ambient orbs */}
    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#92B061]/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#92B061]/10 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

    <div className="max-w-5xl mx-auto relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/5 text-white/60 text-[10px] uppercase tracking-[0.3em] mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#92B061] inline-block" />
          Fonctionnalité exclusive
        </div>

        <h2 className="text-[clamp(34px,5.5vw,68px)] font-serif text-white leading-tight mb-8">
          Votre plante idéale,<br /><span className="italic text-[#92B061]">trouvée en 3 questions.</span>
        </h2>

        <p className="text-white/50 text-lg font-light max-w-xl mx-auto mb-14 leading-relaxed">
          Notre Plant Finder analyse votre espace, votre style de vie et vos préférences
          pour vous proposer les espèces qui prospéreront chez vous.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/plant-finder"
            className="group flex items-center gap-3 px-12 py-5 bg-[#92B061] text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-full hover:bg-white hover:text-[#274d00] transition-all duration-500 shadow-2xl shadow-black/30"
          >
            Lancer le Plant Finder
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {['Luminosité adaptée', 'Entretien personnalisé', 'Budget maîtrisé', 'Espace optimisé', 'Pet-friendly'].map(tag => (
            <span key={tag} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-[11px] font-light tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: TESTIMONIALS
───────────────────────────────────────────── */
const testimonials = [
  { name: 'Camille Dubois', role: 'Architecte d\'intérieur', text: 'Inspyra est la seule boutique où je commande pour mes clients. La qualité est irréprochable, l\'emballage magistral.', stars: 5 },
  { name: 'Youssef M.', role: 'Passionné de botanique', text: 'J\'ai enfin arrêté de tuer mes plantes. Les guides de soin inclus sont d\'une précision remarquable.', stars: 5 },
  { name: 'Sofia R.', role: 'Styliste maison', text: 'L\'esthétique du packaging à elle seule justifie la commande. Et la plante était en parfait état à la livraison.', stars: 5 },
];

const Testimonials = () => (
  <section className="py-36 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-4">Témoignages</p>
        <h2 className="text-[clamp(34px,5vw,58px)] font-serif text-[#274d00]">
          Ils ont choisi <span className="italic">l'excellence.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(({ name, role, text, stars }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="glass rounded-[2.5rem] p-10 border border-white/40 hover:border-[#92B061]/30 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="flex gap-1 mb-8">
              {[...Array(stars)].map((_, j) => (
                <Star key={j} size={14} className="fill-[#92B061] text-[#92B061]" />
              ))}
            </div>
            <p className="text-gray-600 font-light leading-relaxed text-[15px] mb-10 italic">"{text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#274d00]/10 flex items-center justify-center text-[#274d00] font-black text-sm">
                {name.charAt(0)}
              </div>
              <div>
                <div className="text-[12px] font-black uppercase tracking-[0.15em] text-[#274d00]">{name}</div>
                <div className="text-[11px] text-gray-400 font-light">{role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   SECTION: FINAL CTA
───────────────────────────────────────────── */
const FinalCta = () => (
  <section className="py-36 px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ea] via-white to-[#e8f0e0] pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#92B061]/10 blur-3xl pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="max-w-3xl mx-auto text-center relative z-10"
    >
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#92B061] mb-8">Commencer</p>
      <h2 className="text-[clamp(40px,6vw,80px)] font-serif text-[#274d00] leading-tight mb-8">
        Prêt à ramener<br /><span className="italic">la nature chez vous ?</span>
      </h2>
      <p className="text-gray-500 text-lg font-light mb-14 max-w-lg mx-auto leading-relaxed">
        Rejoignez 12 000 amoureux du végétal qui ont transformé leur espace avec Inspyra.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/shop"
          className="group flex items-center gap-3 px-14 py-5 bg-[#274d00] text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-full hover:bg-[#92B061] transition-all duration-500 shadow-2xl shadow-[#274d00]/20"
        >
          Explorer la boutique
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/plant-finder"
          className="flex items-center gap-3 px-12 py-5 border border-[#274d00]/30 text-[#274d00] font-light text-[11px] uppercase tracking-[0.25em] rounded-full hover:border-[#274d00] transition-all duration-500"
        >
          Tester le Plant Finder
        </Link>
      </div>
      <p className="mt-10 text-xs text-gray-400 font-light tracking-wide">
        Livraison gratuite dès 500 MAD · Garantie 30 jours · Support botanique inclus
      </p>
    </motion.div>
  </section>
);

/* ─────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────── */
const LandingPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getPlants({ ordering: '-created_at', page_size: 4 })
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero />
      <Manifesto />
      <TrustBar />
      <FeaturedProducts products={products} />
      <EditorialExcellence />
      <CategoriesShowcase />
      <PlantFinderTeaser />
      <Testimonials />
      <FinalCta />
    </div>
  );
};

export default LandingPage;