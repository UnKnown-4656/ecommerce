import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=70&w=1920',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=70&w=1920',
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
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentHero ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ contain: 'layout style' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg" />
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              width="1920"
              height="1080"
              style={{ contentVisibility: 'auto' }}
            />
          </motion.div>
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
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x533/111/1e1e1e?text=NOIR';
                    }}
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