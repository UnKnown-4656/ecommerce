import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] font-light text-[#0f0f0f] select-none pointer-events-none leading-none">
            2026
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />
          </div>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted mb-8"
          >
            SS 2026 Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="font-display text-[clamp(4rem,11vw,10rem)] font-light leading-[0.92] tracking-tight"
          >
            <span className="block text-text">Dress With</span>
            <span className="block text-accent italic">Intent</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-px bg-accent w-10 mx-auto my-10 origin-left"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted mb-12"
          >
            Premium clothing for the modern wardrobe
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/shop"
              className="btn-primary"
            >
              Explore Collection
            </Link>
            <Link
              to="/shop"
              className="btn-secondary"
            >
              New Arrivals
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-muted">Scroll</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </section>

      <MarqueeStrip />

      <section className="max-w-container mx-auto px-6 md:px-12 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-4">
            Curated For You
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-text">
            The Collection
          </h2>
          <div className="h-px bg-accent w-10 mx-auto mt-6" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-surface animate-pulse mb-5" />
                <div className="h-3 w-16 bg-surface animate-pulse mb-3" />
                <div className="h-5 w-32 bg-surface animate-pulse" />
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

        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16 md:mt-20"
          >
            <Link to="/shop" className="btn-secondary">
              View All Pieces
            </Link>
          </motion.div>
        )}
      </section>

      <section className="py-24 md:py-40 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-2xl md:text-4xl lg:text-5xl italic text-text leading-relaxed max-w-4xl mx-auto"
          >
            "Style is a way to say who you are without having to speak."
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-px bg-accent w-12 mx-auto mt-10 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted mt-6"
          >
            — Rachel Zoe
          </motion.p>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-4">
                Our Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-text mb-8 leading-tight">
                Crafted With<br />
                <span className="text-accent italic">Purpose</span>
              </h2>
              <div className="h-px bg-accent w-10 mb-8" />
              <p className="font-sans text-muted leading-relaxed mb-6 max-w-md">
                Each piece in our collection is thoughtfully designed to transcend seasons and trends. 
                We believe in investing in quality over quantity, creating garments that become 
                timeless staples in your wardrobe.
              </p>
              <p className="font-sans text-muted leading-relaxed mb-10 max-w-md">
                Our commitment to sustainable practices ensures that every creation leaves 
                minimal impact on the environment while maximizing style and comfort.
              </p>
              <Link to="/shop" className="btn-secondary">
                Discover More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-surface overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Luxury fashion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-accent/30" />
              <div className="absolute -top-6 -right-6 w-32 h-32 border border-accent/30" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-surface border-t border-border">
        <div className="max-w-container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-text">
              The NOIR & CO. Difference
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
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
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="h-px w-12 bg-accent mx-auto mb-8" />
                <h3 className="font-display text-2xl text-text mb-4">{item.title}</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;