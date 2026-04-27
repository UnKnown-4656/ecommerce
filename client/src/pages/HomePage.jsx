import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop',
];

const SIDE_IMAGES = [
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=687&auto=format&fit=crop',
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.15]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let loaded = 0;
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === HERO_IMAGES.length) setHeroLoaded(true);
      };
      img.src = src;
    });
  }, []);

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

  return (
    <div className="bg-bg">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMAGES[heroIndex]}
              alt="Hero Background"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />
        </motion.div>

        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
          className="hidden xl:block absolute left-12 top-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative">
            <div className="w-44 h-64 overflow-hidden border border-accent/20">
              <img
                src={SIDE_IMAGES[0]}
                alt="Fashion piece"
                className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-1000"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/10 -z-10" />
            <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-muted/50 mt-4 text-center">SS 2026</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.3, duration: 1.5, ease: "easeOut" }}
          className="hidden xl:block absolute right-12 top-1/2 -translate-y-[40%] z-20"
        >
          <div className="relative">
            <div className="w-36 h-52 overflow-hidden border border-accent/20">
              <img
                src={SIDE_IMAGES[1]}
                alt="Fashion piece"
                className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-1000"
                loading="eager"
              />
            </div>
            <div className="absolute -top-3 -left-3 w-full h-full border border-accent/10 -z-10" />
            <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-muted/50 mt-4 text-center">Exclusive</p>
          </div>
        </motion.div>

        <div className="relative z-20 text-center px-6">
          <motion.div
            style={{ opacity }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
              className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent w-48 mx-auto mb-10 origin-center"
            />

            <motion.p
              initial={{ opacity: 0, letterSpacing: "1.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.6em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="font-sans text-[10px] md:text-[12px] uppercase text-accent mb-8"
            >
              The 2026 Collection
            </motion.p>

            <div className="relative mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(3rem,10vw,10rem)] font-light leading-[0.85] tracking-tight text-text"
              >
                NOIR
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="text-accent mx-4 inline-block"
                >
                  &
                </motion.span>
                <br />
                <span className="italic font-normal">CO.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.04 }}
                transition={{ delay: 1.2, duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] font-bold text-white select-none pointer-events-none leading-none z-[-1]"
              >
                NOIR
              </motion.div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
              className="h-px bg-accent/50 w-24 mx-auto mb-10"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="font-sans text-[11px] md:text-[13px] tracking-[0.2em] uppercase text-muted/80 mb-14 max-w-lg mx-auto leading-relaxed"
            >
              Defining the future of luxury through minimal design <br className="hidden md:block" /> and impeccable craftsmanship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/shop"
                className="group relative overflow-hidden px-14 py-5 text-[11px] tracking-[0.3em] uppercase font-medium bg-accent text-bg transition-all duration-500 hover:shadow-[0_0_40px_rgba(184,146,46,0.3)]"
              >
                <span className="relative z-10">Shop Collection</span>
                <div className="absolute inset-0 bg-accent-hover transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
              <Link
                to="/shop"
                className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-text hover:text-accent transition-colors"
              >
                <span>Our Story</span>
                <div className="w-8 h-px bg-text group-hover:bg-accent group-hover:w-14 transition-all duration-300" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="flex items-center gap-3 justify-center mt-16"
            >
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`transition-all duration-500 ${
                    i === heroIndex
                      ? 'w-8 h-[2px] bg-accent'
                      : 'w-3 h-[2px] bg-muted/30 hover:bg-muted/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-muted vertical-text">Scroll</span>
          <motion.div
            animate={{ height: [12, 24, 12] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>

        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-accent/15 z-20 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-accent/15 z-20 hidden md:block" />
      </section>

      <MarqueeStrip />

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-surface mb-5" />
                  <div className="h-3 w-16 bg-surface mb-3" />
                  <div className="h-5 w-32 bg-surface" />
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

      <section className="py-32 md:py-48 relative overflow-hidden bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-accent mb-8">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-12">
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
              { title: 'Outerwear', desc: 'Timeless coats & jackets', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop' },
              { title: 'Essentials', desc: 'Refined basics', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop' },
              { title: 'Accessories', desc: 'Finishing touches', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
            ].map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                <Link to="/shop" className="group block relative aspect-[3/4] overflow-hidden">
                  <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    loading="lazy"
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