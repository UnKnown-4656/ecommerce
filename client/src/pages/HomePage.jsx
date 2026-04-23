import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
<section style={{ 
  height: '100vh', background: '#0a0a0a',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  position: 'relative', overflow: 'hidden'
}}>
  {/* Editorial 2026 background */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '20vw',
    fontFamily: 'Cormorant Garamond',
    color: '#111111',
    zIndex: 0,
    fontWeight: 300
  }}>2026</div>

  {/* Radial gold glow */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px', height: '700px',
    background: 'radial-gradient(ellipse, rgba(184,146,46,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0
  }} />

  {/* Content wrapper */}
  <div style={{ zIndex: 1, position: 'relative' }}>
    {/* Season tag */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      style={{ 
        fontFamily: 'Inter', fontSize: '11px',
        letterSpacing: '0.3em', color: '#3a3a3a',
        textTransform: 'uppercase', marginBottom: '1rem'
      }}
    >SS 2026 Collection</motion.p>

    {/* Main headline */}
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
      style={{
        fontFamily: 'Cormorant Garamond',
        fontSize: 'clamp(5rem, 12vw, 10rem)',
        fontWeight: 300,
        letterSpacing: '-0.02em',
        color: '#e8e0d4',
        textAlign: 'center',
        lineHeight: 1
      }}
    >
      Dress With{' '}
      <em style={{ color: '#b8922e', fontStyle: 'italic' }}>Intent</em>
    </motion.h1>

    {/* Gold divider */}
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      style={{ 
        width: '48px', height: '1px',
        background: '#b8922e', margin: '1rem auto'
      }}
    />

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      style={{
        fontFamily: 'Inter', fontSize: '11px',
        letterSpacing: '0.25em', color: '#444',
        textTransform: 'uppercase', marginBottom: '2rem'
      }}
    >Premium clothing for the modern wardrobe</motion.p>

    {/* CTA buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{ display: 'flex', gap: '1rem' }}
    >
    <Link to="/shop" style={{
      padding: '12px 40px',
      background: '#b8922e', color: '#0a0a0a',
      fontFamily: 'Inter', fontSize: '11px',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      fontWeight: 500, border: 'none',
      transition: 'background 0.3s'
    }}
    onMouseEnter={e => e.target.style.background='rgba(184,146,46,0.8)'}
    onMouseLeave={e => e.target.style.background='#b8922e'}
    >Explore Collection</Link>

    <Link to="/shop" style={{
      padding: '12px 40px',
      background: 'transparent',
      color: '#b8922e',
      fontFamily: 'Inter', fontSize: '11px',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      border: 'none',
      transition: 'all 0.3s'
    }}
    onMouseEnter={e => e.target.style.color='#d4aa50'}
    onMouseLeave={e => e.target.style.color='#b8922e'}
    >New Arrivals</Link>
  </motion.div>
  </div>

  {/* Scroll indicator */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.8 }}
    style={{
      position: 'absolute', bottom: '3rem',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '8px',
      zIndex: 1
    }}
  >
    <span style={{ 
      fontFamily: 'Inter', fontSize: '9px',
      letterSpacing: '0.3em', color: '#2a2a2a',
      textTransform: 'uppercase'
    }}>Scroll</span>
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, #b8922e, transparent)'
      }}
    />
  </motion.div>
</section>

      <MarqueeStrip />

      {/* Featured Products */}
      <section style={{ padding: '4rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          style={{ textAlign:'center', marginBottom:'4rem' }}
        >
          <p style={{ fontFamily:'Inter', fontSize:'10px',
            letterSpacing:'0.3em', color:'#444',
            textTransform:'uppercase', marginBottom:'1rem'
          }}>Curated For You</p>
          <h2 style={{ fontFamily:'Cormorant Garamond',
            fontSize:'clamp(2.5rem, 5vw, 4rem)',
            fontWeight:300, color:'#e8e0d4'
          }}>The Collection</h2>
          <div style={{ width:'40px', height:'1px',
            background:'#b8922e', margin:'1.5rem auto 0'
          }} />
        </motion.div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/shop" style={{
            padding: '14px 36px',
            background: 'transparent',
            color: '#b8922e',
            fontFamily: 'Inter', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            border: '1px solid #b8922e',
            transition: 'all 0.3s',
            display: 'inline-block'
          }}
          onMouseEnter={e => { e.target.style.background='#b8922e'; e.target.style.color='#0a0a0a'; }}
          onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='#b8922e'; }}
          >View All</Link>
        </div>
      </section>

      {/* Editorial quote strip */}
      <motion.section
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        viewport={{ once:true }}
        transition={{ duration:1.2 }}
        style={{
          padding:'8rem 2rem',
          borderTop:'1px solid #1a1a1a',
          borderBottom:'1px solid #1a1a1a',
          textAlign:'center', background:'#0a0a0a'
        }}
      >
        <p style={{
          fontFamily:'Cormorant Garamond',
          fontSize:'clamp(1.8rem, 4vw, 3.5rem)',
          fontWeight:300, fontStyle:'italic',
          color:'#e8e0d4', maxWidth:'700px',
          margin:'0 auto', lineHeight:1.4
        }}>
          "Luxury is not about price.
          <br/>It's about{' '}
          <span style={{ color:'#b8922e' }}>intent.</span>"
        </p>
        <div style={{ width:'40px', height:'1px',
          background:'#b8922e', margin:'2rem auto'
        }} />
        <p style={{ fontFamily:'Inter', fontSize:'10px',
          letterSpacing:'0.3em', color:'#333',
          textTransform:'uppercase'
        }}>Crafted for those who dress with purpose</p>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;