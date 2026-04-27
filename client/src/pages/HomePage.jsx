import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=70&w=1920',
  'https://images.unsplash.com/photo-1445205170230-053b83e26dd7?auto=format&fit=crop&q=70&w=1920',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=70&w=1920'
];

const SIDE_IMAGES = [
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=70&w=600',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=70&w=600'
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="bg-bg overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"><AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-black"
          >
            <img
              src={HERO_IMAGES[heroIndex]}
              alt="Noir & Co Luxury Fashion"
              className="w-full h-full object-cover grayscale-[20%]"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width="1920"
              height="1080"
              onLoad={(e) => {
                // Preload next image
                const nextIndex = (heroIndex + 1) % HERO_IMAGES.length;
                const img = new Image();
                img.src = HERO_IMAGES[nextIndex];
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

        {/* Floating Editorial Images (Fixed positions to avoid shift) */}
        <div className="absolute top-1/4 left-12 z-20 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="group relative"
          >
            <div className="w-44 h-64 overflow-hidden border border-accent/20 bg-surface">
              <img
                src={SIDE_IMAGES[0]}
                alt="Editorial Look 1"
                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
                width="176"
                height="256"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-32 border border-accent/10 bg-surface -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
          </motion.div>
        </div>

        <div className="absolute bottom-1/4 right-12 z-20 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="group relative"
          >
            <div className="w-36 h-52 overflow-hidden border border-accent/20 bg-surface">
              <img
                src={SIDE_IMAGES[1]}
                alt="Editorial Look 2"
                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
                width="144"
                height="208"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-28 border border-accent/10 bg-surface -z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
          </motion.div>
        </div>

        <motion.div 
          style={{ y: textY }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-accent mb-4 block">
              Redefining Modern Elegance
            </span>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-text leading-none tracking-tighter mb-6">
              NOIR <span className="italic text-muted/30">&</span> CO.
            </h1>
            <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-muted/80 max-w-xl mx-auto leading-relaxed">
              Where minimal design meets impeccable craftsmanship.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
          >
            <Link to="/shop" className="group relative overflow-hidden px-14 py-5 text-[11px] tracking-[0.3em] uppercase font-medium bg-accent text-bg transition-all duration-500">
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-accent-hover transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
            <Link to="/shop" className="group flex items-center gap-4 text-text/60 hover:text-accent transition-colors duration-300">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase">View Lookbook</span>
              <div className="w-10 h-[1px] bg-accent/30 group-hover:w-16 transition-all duration-500" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-muted vertical-text">Scroll</span>
          <motion.div
            animate={{ height: [12, 24, 12] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </section>

      <MarqueeStrip />

      {/* ═══════════════════════ FEATURED GALLERY ═══════════════════════ */}
      <section className="py-24 md:py-40 border-t border-border relative overflow-hidden">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Curated Pieces</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-text">
                Featured <span className="italic text-accent">Gallery</span>
              </h2>
            </motion.div>
            <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors mb-2">
              View All Arrivals
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-surface overflow-hidden animate-pulse rounded-sm" />
                  <div className="h-4 bg-surface w-2/3 animate-pulse rounded-sm" />
                  <div className="h-4 bg-surface w-1/3 animate-pulse rounded-sm" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted text-sm tracking-wider uppercase">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ PHILOSOPHY ═══════════════════════ */}
      <section className="py-32 md:py-48 relative overflow-hidden bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-accent mb-8">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-12 text-text">
              "Luxury is in the <br />
              <span className="italic text-accent">details</span>"
            </h2>
            <p className="text-muted/70 text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
              Every stitch, every fabric choice, every silhouette is meticulously crafted to embody 
              the essence of modern elegance. We believe in pieces that transcend seasons and speak 
              to the soul of discerning individuals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ CATEGORIES ═══════════════════════ */}
      <section className="py-24 md:py-40 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Categories</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-text">
                Shop by <span className="italic text-accent">Style</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Outerwear', desc: 'Timeless coats & jackets', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=70&w=800&auto=format&fit=crop' },
              { title: 'Essentials', desc: 'Refined basics', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=800&auto=format&fit=crop' },
              { title: 'Accessories', desc: 'Finishing touches', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=70&w=800&auto=format&fit=crop' },
            ].map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                <Link to="/shop" className="group block relative aspect-[3/4] overflow-hidden bg-surface">
                  <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="533"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-accent mb-2">{category.desc}</p>
                    <h3 className="font-display text-2xl md:text-3xl text-text">{category.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ NEWSLETTER ═══════════════════════ */}
      <section className="py-24 border-t border-border bg-surface/50">
        <div className="max-w-container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h3 className="font-display text-2xl md:text-3xl text-text mb-4">Join the NOIR Circle</h3>
              <p className="text-muted text-sm tracking-wide">Be the first to know about new collections and exclusive offers.</p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 md:w-80 px-6 py-4 bg-transparent border border-border text-text text-sm focus:border-accent focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-10 py-4 bg-accent text-bg text-[10px] uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors"
              >
                Subscribe
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;