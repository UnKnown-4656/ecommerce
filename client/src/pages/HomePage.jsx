import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

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

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#b8922e",
      },
      links: {
        color: "#b8922e",
        distance: 150,
        enable: false,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), []);

  return (
    <div className="bg-bg">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover grayscale-[30%]"
          />
        </motion.div>

        {/* Particles */}
        {init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-10 pointer-events-none"
          />
        )}

        {/* Content Layer */}
        <div className="relative z-20 text-center px-6">
          <motion.div
            style={{ opacity }}
            className="max-w-5xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "1.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.6em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="font-sans text-[10px] md:text-[12px] uppercase text-accent mb-12"
            >
              The 2026 Collection
            </motion.p>

            <div className="relative mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(3.5rem,12vw,12rem)] font-light leading-[0.85] tracking-tight text-text"
              >
                CRAFTED <br />
                <span className="italic text-accent ml-[0.1em]">EXCELLENCE</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1, duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[20vw] font-bold text-white select-none pointer-events-none leading-none z-[-1] blur-sm"
              >
                NOIR
              </motion.div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
              className="h-px bg-accent/50 w-24 mx-auto mb-12"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="font-sans text-[11px] md:text-[13px] tracking-[0.2em] uppercase text-muted/80 mb-16 max-w-xl mx-auto leading-relaxed"
            >
              Defining the future of luxury through minimal design <br className="hidden md:block" /> and impeccable craftsmanship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            >
              <Link
                to="/shop"
                className="btn-primary px-12 py-5 text-[11px] tracking-[0.3em]"
              >
                View Collection
              </Link>
              <Link
                to="/shop"
                className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-text hover:text-accent transition-colors"
              >
                <span>Our Story</span>
                <div className="w-8 h-px bg-text group-hover:bg-accent group-hover:w-12 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-muted vertical-text">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        </motion.div>
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
            <p className="font-display text-2xl italic text-muted text-center py-20">
              No products found.
            </p>
          )}
        </div>
      </section>

      <section className="py-24 md:py-40 bg-surface/30">
        <div className="max-w-container mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <span className="font-display text-[15vw] text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none italic">
              Legacy
            </span>
            <p className="font-display text-2xl md:text-4xl lg:text-5xl italic text-text leading-relaxed max-w-4xl mx-auto relative z-10">
              "Style is a way to say who you are without having to speak."
            </p>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-px bg-accent w-12 mx-auto mt-12 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted mt-8"
          >
            — Rachel Zoe
          </motion.p>
        </div>
      </section>

      <section className="py-32 md:py-48 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-6">Our Philosophy</p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-text mb-10 leading-[1.1]">
                Crafted With<br />
                <span className="text-accent italic">Purpose</span>
              </h2>
              <div className="h-px bg-accent w-12 mb-10" />
              <div className="space-y-6 text-muted font-sans text-sm md:text-base leading-relaxed max-w-md">
                <p>
                  Each piece in our collection is thoughtfully designed to transcend seasons and trends. 
                  We believe in investing in quality over quantity, creating garments that become 
                  timeless staples in your wardrobe.
                </p>
                <p>
                  Our commitment to sustainable practices ensures that every creation leaves 
                  minimal impact on the environment while maximizing style and comfort.
                </p>
              </div>
              <motion.div className="mt-12" whileHover={{ x: 10 }}>
                <Link to="/shop" className="btn-secondary">
                  Discover Our Story
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109132384-3615557de103?q=80&w=1974&auto=format&fit=crop" 
                alt="Philosophy" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 border-[20px] border-bg/50 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            {[
              { title: 'Timeless Design', desc: 'Each piece is crafted to remain relevant beyond fleeting trends, becoming a lasting element of your personal style.' },
              { title: 'Premium Quality', desc: 'We source only the finest materials and partner with skilled artisans who share our commitment to excellence.' },
              { title: 'Sustainable Practice', desc: 'From production to packaging, we prioritize environmental responsibility at every step of our process.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="h-px w-8 bg-accent/30 mx-auto mb-8 group-hover:w-16 transition-all duration-500" />
                <h3 className="font-display text-2xl text-text mb-6 tracking-wide group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="font-sans text-[13px] text-muted leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;