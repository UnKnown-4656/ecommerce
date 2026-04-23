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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#0a0a0a', minHeight: '100vh' }}
    >
      {/* ── HERO ── */}
      <section style={{
        height: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '0 2rem',
      }}>

        {/* Big background year */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '28vw',
          fontFamily: 'Cormorant Garamond, serif',
          color: '#0f0f0f',
          zIndex: 0,
          fontWeight: 300,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}>2026</div>

        {/* Gold radial glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px',
          background: 'radial-gradient(ellipse, rgba(184,146,46,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.35em',
              color: '#333',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >SS 2026 Collection</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(4.5rem, 11vw, 10rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#e8e0d4',
              lineHeight: 0.95,
              marginBottom: 0,
            }}
          >
            Dress With
            <br />
            <em style={{ color: '#b8922e', fontStyle: 'italic' }}>Intent</em>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              width: '40px', height: '1px',
              background: '#b8922e',
              margin: '1.8rem auto',
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.28em',
              color: '#3a3a3a',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}
          >Premium clothing for the modern wardrobe</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/shop"
              style={{
                padding: '14px 44px',
                background: '#b8922e',
                color: '#0a0a0a',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
                border: 'none',
                display: 'inline-block',
                transition: 'background 0.3s, transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#d4aa50'}
              onMouseLeave={e => e.currentTarget.style.background = '#b8922e'}
            >Explore Collection</Link>

            <Link
              to="/shop"
              style={{
                padding: '14px 44px',
                background: 'transparent',
                color: '#b8922e',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid #b8922e',
                display: 'inline-block',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#b8922e';
                e.currentTarget.style.color = '#0a0a0a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#b8922e';
              }}
            >New Arrivals</Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'absolute', bottom: '2.5rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '10px', zIndex: 1,
          }}
        >
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '8px',
            letterSpacing: '0.35em',
            color: '#222',
            textTransform: 'uppercase',
          }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px', height: '50px',
              background: 'linear-gradient(to bottom, #b8922e, transparent)',
            }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <MarqueeStrip />

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{
        padding: '6rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.35em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>Curated For You</p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 300,
            color: '#e8e0d4',
            margin: 0,
          }}>The Collection</h2>
          <div style={{
            width: '36px', height: '1px',
            background: '#b8922e',
            margin: '1.5rem auto 0',
          }} />
        </motion.div>

        {/* Product grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{
                  aspectRatio: '3/4', marginBottom: '1rem',
                }} />
                <div className="skeleton" style={{
                  height: '12px', width: '60%', marginBottom: '8px',
                }} />
                <div className="skeleton" style={{
                  height: '20px', width: '80%',
                }} />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p style={{
            textAlign: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            fontStyle: 'italic',
            color: '#333',
          }}>No products found.</p>
        )}

        {/* View all */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '4rem' }}
          >
            <Link
              to="/shop"
              style={{
                padding: '14px 48px',
                background: 'transparent',
                color: '#b8922e',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid #1e1e1e',
                display: 'inline-block',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#b8922e';
                e.currentTarget.style.color = '#d4aa50';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e1e';
                e.currentTarget.style.color = '#b8922e';
              }}
            >View All Pieces</Link>
          </motion.div>
        )}
      </section>

      {/* ── EDITORIAL QUOTE ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{
          padding: '10rem 2rem',
          borderTop: '1px solid #111',
          borderBottom: '1px solid #111',
          textAlign: 'center',
          background: '#0a0a0a',
        }}
      >
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#e8e0d4',
          maxWidth: '680px',
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          "Luxury is not about price.
          <br />It's about{' '}
          <span style={{ color: '#b8922e' }}>intent.</span>"
        </p>
        <div style={{
          width: '36px', height: '1px',
          background: '#b8922e',
          margin: '2.5rem auto',
        }} />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.32em',
          color: '#2a2a2a',
          textTransform: 'uppercase',
        }}>Crafted for those who dress with purpose</p>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;