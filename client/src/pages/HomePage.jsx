import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
];

const SIDE_IMAGES = [
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581044777550-4cfa60707998?q=80&w=686&auto=format&fit=crop',
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.15]);

  // Cycle hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Preload hero images
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
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: "#b8922e" },
      links: { color: "#b8922e", distance: 150, enable: false, opacity: 0.15, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.3, straight: false },
      number: { density: { enable: true, area: 1200 }, value: 25 },
      opacity: { value: { min: 0.1, max: 0.3 } },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  }), []);

  return (
    <div className="bg-bg">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Slideshow */}
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
          {/* Dark gradient overlays for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />
        </motion.div>

        {/* Particles */}
        {init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-10 pointer-events-none"
          />
        )}

        {/* Floating Side Fashion Images (desktop only) */}
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

        {/* Content Layer */}
        <div className="relative z-20 text-center px-6">
          <motion.div
            style={{ opacity }}
            className="max-w-5xl mx-auto"
          >
            {/* Top decorative line */}
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

              {/* Ghost watermark text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.04 }}
                transition={{ delay: 1.2, duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] font-bold text-white select-none pointer-events-none leading-none z-[-1]"
              >
                NOIR
              </motion.div>
            </div>

            {/* Animated accent line */}
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

            {/* Hero image slideshow indicators */}
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

        {/* Scroll Indicator */}
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

        {/* Corner decorative elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-accent/15 z-20 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-accent/15 z-20 hidden md:block" />
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

      {/* ═══════════════════════ EDITORIAL SPLIT SECTION ═══════════════════════ */}
      <section className="py-0 border-t border-border">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
              alt="Editorial fashion"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-accent mb-3">Editorial</p>
              <h3 className="font-display text-3xl md:text-4xl text-white leading-tight">
                The Art of<br /><span className="italic">Understated Luxury</span>
              </h3>
            </div>
          </motion.div>
          <div className="flex items-center justify-center px-12 md:px-20 py-20 lg:py-0 bg-surface/20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md"
            >
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-6">Our Vision</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-text mb-8 leading-tight">
                Where Fashion <br />Meets <span className="text-accent italic">Intention</span>
              </h2>
              <div className="h-px bg-accent/40 w-16 mb-8" />
              <p className="text-muted font-sans text-sm leading-relaxed mb-6">
                We don't follow trends — we set them. Every stitch, every fabric choice,
                every silhouette is deliberately crafted to empower those who wear our pieces
                with quiet confidence.
              </p>
              <p className="text-muted font-sans text-sm leading-relaxed mb-10">
                From sustainably sourced textiles to zero-waste production, NOIR & CO.
                proves that luxury and responsibility can coexist beautifully.
              </p>
              <Link to="/shop" className="btn-secondary">
                Explore the Vision
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ QUOTE SECTION ═══════════════════════ */}
      <section className="py-24 md:py-40 bg-surface/30">
        <div className="max-w-container mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <span className="font-display text-[15vw] text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none italic">
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

      {/* ═══════════════════════ PHILOSOPHY ═══════════════════════ */}
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
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop"
                alt="Philosophy"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                loading="lazy"
              />
              <div className="absolute inset-0 border-[20px] border-bg/50 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VALUES ═══════════════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            {[
              { num: '01', title: 'Timeless Design', desc: 'Each piece is crafted to remain relevant beyond fleeting trends, becoming a lasting element of your personal style.' },
              { num: '02', title: 'Premium Quality', desc: 'We source only the finest materials and partner with skilled artisans who share our commitment to excellence.' },
              { num: '03', title: 'Sustainable Practice', desc: 'From production to packaging, we prioritize environmental responsibility at every step of our process.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center group"
              >
                <span className="font-mono text-accent/30 text-xs tracking-widest mb-6 block">{item.num}</span>
                <div className="h-px w-8 bg-accent/30 mx-auto mb-8 group-hover:w-16 transition-all duration-500" />
                <h3 className="font-display text-2xl text-text mb-6 tracking-wide group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="font-sans text-[13px] text-muted leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ NEWSLETTER CTA ═══════════════════════ */}
      <section className="py-24 md:py-32 bg-surface/40 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-6">Stay Connected</p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-text mb-6">
              Join the <span className="italic text-accent">Inner Circle</span>
            </h2>
            <p className="font-sans text-sm text-muted leading-relaxed mb-10">
              Be the first to know about new collections, exclusive events, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-bg border border-border text-text placeholder:text-muted/40 text-sm focus:outline-none focus:border-accent transition-colors"
              />
              <button className="btn-primary px-8 py-4 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="font-sans text-[10px] text-muted/50 mt-4 tracking-wide">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;