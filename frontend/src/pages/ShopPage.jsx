import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Search, X, LayoutGrid, List,
  ChevronLeft, ChevronRight, SlidersHorizontal, Leaf,
} from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';

/* ── Pagination constants ── */
const PAGE_SIZE = 9;

/* ── Pill component for active filters ── */
const FilterPill = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#274d00]/8 border border-[#274d00]/15 text-[10px] font-black uppercase tracking-[0.2em] text-[#274d00] dark:text-white dark:bg-white/5 dark:border-white/10"
  >
    {label}
    <button onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">
      <X size={10} />
    </button>
  </motion.span>
);

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="animate-pulse space-y-5">
    <div className="aspect-[3/4] rounded-[3rem] bg-[#274d00]/5 dark:bg-white/5" />
    <div className="space-y-2 px-2">
      <div className="h-2.5 bg-[#274d00]/5 rounded-full w-1/3" />
      <div className="h-4 bg-[#274d00]/5 rounded-full w-3/4" />
    </div>
  </div>
);

/* ── Pagination component ── */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 pt-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#274d00]/10 dark:border-white/10 text-[#274d00]/50 dark:text-white/50 hover:text-[#274d00] dark:hover:text-white hover:border-[#274d00]/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <ChevronLeft size={14} /> Précédent
      </button>

      <div className="flex items-center gap-1.5">
        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`dot-${i}`} className="w-9 text-center text-[#274d00]/30 dark:text-white/30 text-sm">
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                currentPage === page
                  ? 'bg-[#274d00] text-white shadow-lg shadow-[#274d00]/20'
                  : 'text-[#274d00]/50 dark:text-white/50 hover:text-[#274d00] dark:hover:text-white hover:bg-[#274d00]/5 dark:hover:bg-white/5'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#274d00]/10 dark:border-white/10 text-[#274d00]/50 dark:text-white/50 hover:text-[#274d00] dark:hover:text-white hover:border-[#274d00]/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-[0.2em]"
      >
        Suivant <ChevronRight size={14} />
      </button>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MAIN SHOP PAGE
══════════════════════════════════════════ */
const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(Number(searchParams.get('maxPrice')) || 2000);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-date');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* Fetch categories once */
  useEffect(() => {
    productService.getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  /* Fetch products on filter/page change */
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: PAGE_SIZE,
        };
        if (search) params.search = search;
        if (activeCategory !== 'all') params.categorie = activeCategory;
        if (priceRange < 2000) params.max_price = priceRange;
        if (sortBy) params.ordering = sortBy;

        const data = await productService.getPlants(params);

        // Support both paginated { count, results } and plain array responses
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalCount(data.length);
        } else {
          setProducts(data.results || []);
          setTotalCount(data.count || 0);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, activeCategory, priceRange, sortBy, currentPage]);

  /* Reset to page 1 when filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, priceRange, sortBy]);

  /* Scroll to top on page change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setPriceRange(2000);
    setSortBy('-date');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' || activeCategory !== 'all' || priceRange < 2000 || sortBy !== '-date';

  const activeCategoryName = categories.find(c => c.id.toString() === activeCategory)?.nom;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050a00]">
      {/* ── PAGE HEADER ── */}
      <div className="relative pt-40 pb-20 px-6 sm:px-8 lg:px-16 overflow-hidden border-b border-[#274d00]/8 dark:border-white/5">
        {/* Ambient orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#92B061]/8 blur-3xl rounded-full pointer-events-none -translate-y-1/4 translate-x-1/4" />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#92B061]">
                Inspyra — Bibliothèque
              </p>
              <h1 className="text-[clamp(52px,8vw,100px)] font-serif text-[#274d00] dark:text-white leading-[0.88] tracking-[-0.03em]">
                Botanical<br />
                <span className="italic">Library.</span>
              </h1>
              <p className="text-sm font-light text-[#274d00]/40 dark:text-white/40 max-w-sm leading-relaxed">
                Une sélection rigoureuse de spécimens d'exception pour sublimer votre quotidien.
              </p>
            </motion.div>

            {/* Search + filter toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
            >
              <div className="relative group w-full sm:w-80">
                <Search
                  size={15}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#274d00]/30 dark:text-white/30 group-focus-within:text-[#92B061] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Rechercher un spécimen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[#274d00]/10 dark:border-white/10 bg-[#274d00]/3 dark:bg-white/3 text-[#274d00] dark:text-white text-sm font-medium placeholder:text-[#274d00]/25 dark:placeholder:text-white/25 focus:outline-none focus:border-[#92B061]/40 focus:ring-2 focus:ring-[#92B061]/10 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#274d00]/30 hover:text-[#274d00] transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-300 whitespace-nowrap ${
                  isFilterOpen
                    ? 'bg-[#274d00] text-white border-[#274d00] shadow-xl shadow-[#274d00]/20'
                    : 'border-[#274d00]/15 dark:border-white/10 text-[#274d00] dark:text-white hover:bg-[#274d00]/5 dark:hover:bg-white/5'
                }`}
              >
                <SlidersHorizontal size={14} />
                Filtres
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#92B061] ml-0.5" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Active filter pills */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 mt-8"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#274d00]/30 dark:text-white/30 mr-1">
                  Filtres actifs :
                </span>
                {search && <FilterPill label={`"${search}"`} onRemove={() => setSearch('')} />}
                {activeCategoryName && (
                  <FilterPill label={activeCategoryName} onRemove={() => setActiveCategory('all')} />
                )}
                {priceRange < 2000 && (
                  <FilterPill label={`≤ ${priceRange} MAD`} onRemove={() => setPriceRange(2000)} />
                )}
                {sortBy !== '-date' && (
                  <FilterPill
                    label={{ prix: 'Prix ↑', '-prix': 'Prix ↓', nom: 'A–Z' }[sortBy] || sortBy}
                    onRemove={() => setSortBy('-date')}
                  />
                )}
                <button
                  onClick={clearFilters}
                  className="text-[9px] font-black uppercase tracking-[0.25em] text-red-400 hover:text-red-500 transition-colors ml-2"
                >
                  Tout effacer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BODY: SIDEBAR + GRID ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 py-14">
        <div className="flex gap-12 lg:gap-16">

          {/* ── SIDEBAR ── */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 280, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <div className="w-[280px] space-y-10 sticky top-28">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.45em] text-[#92B061]">
                      Catégories
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => setActiveCategory('all')}
                        className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                          activeCategory === 'all'
                            ? 'bg-[#274d00] text-white shadow-lg shadow-[#274d00]/15'
                            : 'text-[#274d00]/50 dark:text-white/50 hover:bg-[#274d00]/5 dark:hover:bg-white/5 hover:text-[#274d00] dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Leaf size={13} /> Toutes les espèces
                        </span>
                        <span className={`text-[10px] font-black ${activeCategory === 'all' ? 'text-white/60' : 'text-[#274d00]/25'}`}>
                          {totalCount}
                        </span>
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id.toString())}
                          className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                            activeCategory === cat.id.toString()
                              ? 'bg-[#274d00] text-white shadow-lg shadow-[#274d00]/15'
                              : 'text-[#274d00]/50 dark:text-white/50 hover:bg-[#274d00]/5 dark:hover:bg-white/5 hover:text-[#274d00] dark:hover:text-white'
                          }`}
                        >
                          <span>{cat.nom}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.45em] text-[#92B061]">
                        Prix maximum
                      </h4>
                      <span className="text-[11px] font-black text-[#274d00] dark:text-white bg-[#274d00]/8 dark:bg-white/8 px-3 py-1 rounded-lg">
                        {priceRange} MAD
                      </span>
                    </div>
                    <div className="relative pt-2">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #274d00 0%, #274d00 ${(priceRange / 2000) * 100}%, rgba(39,77,0,0.1) ${(priceRange / 2000) * 100}%, rgba(39,77,0,0.1) 100%)`,
                          accentColor: '#274d00',
                        }}
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-[#274d00]/30 dark:text-white/30 font-medium">
                        <span>0</span>
                        <span>2000 MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.45em] text-[#92B061]">
                      Trier par
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { value: '-date', label: 'Dernières arrivées' },
                        { value: 'prix', label: 'Prix croissant' },
                        { value: '-prix', label: 'Prix décroissant' },
                        { value: 'nom', label: 'Alphabétique' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setSortBy(value)}
                          className={`px-5 py-3 rounded-xl text-left text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                            sortBy === value
                              ? 'bg-[#92B061]/15 text-[#274d00] dark:text-white border border-[#92B061]/30'
                              : 'text-[#274d00]/40 dark:text-white/40 hover:bg-[#274d00]/5 dark:hover:bg-white/5 hover:text-[#274d00] dark:hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full py-4 rounded-2xl border border-red-200/60 dark:border-red-500/20 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-[0.3em]"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── PRODUCT GRID ── */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-6 border-b border-[#274d00]/6 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#274d00]/25 dark:text-white/25">
                {loading ? '—' : totalCount} spécimen{totalCount !== 1 ? 's' : ''}{' '}
                {totalPages > 1 && (
                  <span className="text-[#274d00]/15 dark:text-white/15">
                    · page {currentPage}/{totalPages}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5">
                {[
                  { mode: 'grid', Icon: LayoutGrid },
                  { mode: 'list', Icon: List },
                ].map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2.5 rounded-xl transition-all ${
                      viewMode === mode
                        ? 'bg-[#274d00]/8 dark:bg-white/8 text-[#274d00] dark:text-white'
                        : 'text-[#274d00]/20 dark:text-white/20 hover:text-[#274d00]/50 dark:hover:text-white/50'
                    }`}
                  >
                    <Icon size={17} />
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-14'
                    : 'flex flex-col gap-10'
                }
              >
                {[...Array(PAGE_SIZE)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 gap-8 text-center"
              >
                <div className="w-24 h-24 rounded-full border border-[#274d00]/10 dark:border-white/10 bg-[#274d00]/3 flex items-center justify-center">
                  <Search size={28} className="text-[#274d00]/15 dark:text-white/15" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-[#274d00] dark:text-white italic">
                    Silence botanique.
                  </h3>
                  <p className="text-sm text-[#274d00]/40 dark:text-white/40 font-light max-w-xs">
                    Aucun spécimen ne correspond à vos critères de recherche actuels.
                  </p>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-10 py-4 bg-[#274d00] text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-xl hover:bg-[#92B061] transition-all"
                >
                  Voir tout le catalogue
                </button>
              </motion.div>
            )}

            {/* Product grid */}
            {!loading && products.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${activeCategory}-${sortBy}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-14'
                      : 'flex flex-col gap-10'
                  }
                >
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;