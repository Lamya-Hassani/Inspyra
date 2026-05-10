import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, X, LayoutGrid, List,
  ChevronLeft, ChevronRight, SlidersHorizontal, Leaf,
} from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';

const PAGE_SIZE = 5;

const FilterPill = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700">
    {label}
    <button onClick={onRemove} className="hover:text-red-500 transition-colors">
      <X size={12} />
    </button>
  </span>
);

const SkeletonCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[4/5] rounded-xl bg-gray-100" />
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-5 bg-gray-100 rounded w-3/4" />
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
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
    <div className="flex items-center justify-center gap-2 pt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`dot-${i}`} className="px-2 text-gray-400">···</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                currentPage === page
                  ? 'bg-[#274d00] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
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
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(Number(searchParams.get('maxPrice')) || 2000);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-date');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    productService.getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, priceRange, sortBy]);

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
    <div className="min-h-screen bg-[#f8faf8]">
      {/* ── PAGE HEADER ── */}
      <div className="pt-5 pb-12 px-6 sm:px-8 lg:px-16 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-[#6D58C7] rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">
                  Notre Collection
                </p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#274d00] tracking-tight">
                Toutes nos plantes
              </h1>
              <p className="text-gray-500 max-w-md font-medium italic">
                "Une sélection rigoureuse pour sublimer votre intérieur."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une espèce..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-bold text-sm"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all ${
                  isFilterOpen
                    ? 'bg-[#274d00] text-white border-[#274d00] shadow-lg shadow-green-100'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#6D58C7] hover:text-[#6D58C7]'
                }`}
              >
                <SlidersHorizontal size={18} />
                Filtres
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3 mt-10 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-[10px] font-black text-purple-400 mr-2 uppercase tracking-widest">Filtres actifs :</span>
              {search && <FilterPill label={search} onRemove={() => setSearch('')} />}
              {activeCategoryName && <FilterPill label={activeCategoryName} onRemove={() => setActiveCategory('all')} />}
              {priceRange < 2000 && <FilterPill label={`Max ${priceRange} MAD`} onRemove={() => setPriceRange(2000)} />}
              <button onClick={clearFilters} className="text-[10px] font-black text-rose-500 hover:underline ml-auto uppercase tracking-widest">Effacer tout</button>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 py-12 ">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── SIDEBAR ── */}
          {isFilterOpen && (
            <aside className="w-full lg:w-64 shrink-0 space-y-10">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Catégories</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      activeCategory === 'all' ? 'bg-[#92B061]/10 text-[#274d00]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Leaf size={16} /> Tout</span>
                    <span className="text-xs opacity-50">{totalCount}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id.toString())}
                      className={`px-4 py-2.5 rounded-lg text-left text-sm font-bold transition-colors ${
                        activeCategory === cat.id.toString() ? 'bg-[#92B061]/10 text-[#274d00]' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.nom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Prix Max</h4>
                  <span className="text-sm font-bold text-[#274d00]">{priceRange} MAD</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#274d00]"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Trier par</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 bg-white"
                >
                  <option value="-date">Dernières arrivées</option>
                  <option value="prix">Prix croissant</option>
                  <option value="-prix">Prix décroissant</option>
                  <option value="nom">Nom A-Z</option>
                </select>
              </div>
            </aside>
          )}

          {/* ── GRID ── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-bold">
                {loading ? 'Chargement...' : `${totalCount} résultats`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-[#274d00]' : 'text-gray-300'}`}><LayoutGrid size={20}/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-[#274d00]' : 'text-gray-300'}`}><List size={20}/></button>
              </div>
            </div>

            {loading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-8"}>
                {[...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-500 mb-6">Nous n'avons pas trouvé de plantes correspondant à vos critères.</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-[#274d00] text-white font-bold rounded-lg hover:bg-[#1e3b00] transition-colors">Effacer les filtres</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
                {/* Frontend slicing as fallback if backend doesn't paginate */}
                {(Array.isArray(products) && products.length > PAGE_SIZE 
                  ? products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) 
                  : products
                ).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;