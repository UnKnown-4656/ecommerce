import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.append('category', category);
        if (search) params.append('search', search);

        const response = await api.get(`/products?${params.toString()}`);
        let result = response.data;

        if (sortBy === 'price-low') {
          result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          result = [...result].sort((a, b) => b.price - a.price);
        }

        setProducts(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sortBy]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <div className="bg-bg min-h-screen pt-24 md:pt-32">
      <div className="max-w-container mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <h1 className="font-display text-5xl md:text-7xl font-light text-text mb-4">
            Shop
          </h1>
          <div className="h-px w-10 bg-accent" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-56 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-32">
              <div className="mb-10">
                <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-6">
                  Search
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                    className="input-luxury pl-10 text-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-10">
                <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-6">
                  Categories
                </p>
                <nav className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`text-left font-sans text-sm transition-colors duration-300 ${
                        category === cat || (cat === 'All' && !category)
                          ? 'text-accent'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mb-10">
                <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-6">
                  Sort By
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-luxury text-sm appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden font-sans text-[10px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] bg-surface animate-pulse mb-5" />
                    <div className="h-3 w-16 bg-surface animate-pulse mb-3" />
                    <div className="h-5 w-32 bg-surface animate-pulse" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center">
                <p className="font-display text-3xl italic text-muted">
                  No pieces found.
                </p>
                <p className="font-sans text-sm text-muted mt-4">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;