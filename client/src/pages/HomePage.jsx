import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

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
    <div>
      {/* Hero Section */}
<section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-no-repeat" 
  style={{ 
    backgroundImage: 'url("/images/editorial-dark.jpg")',
    background: 'radial-gradient(ellipse at center, #1A1508 0%, #0A0A0A 100%)'
  }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg z-10" />
        <div className="relative z-20 px-4 max-w-5xl mx-auto">
          <motion.h1 
            className="font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          >
            Dress With <span className="text-accent">Intent</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted font-light mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Premium clothing for the modern wardrobe
          </motion.p>

          <div className="w-[60px] h-[1px] bg-accent mx-auto mb-8" />

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/shop" className="btn btn-primary">
              Explore Collection
            </Link>
            <Link to="/shop?category=Outerwear" className="btn btn-outline">
              New Arrivals
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-4xl text-center mb-12">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/shop" className="btn btn-outline inline-block">
            View All
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="font-display text-2xl mb-2">Premium Materials</h3>
              <p className="text-muted">Only the finest fabrics sourced from around the world.</p>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl mb-2">Crafted with Care</h3>
              <p className="text-muted">Every piece is meticulously constructed for longevity.</p>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl mb-2">Timeless Design</h3>
              <p className="text-muted">Styles that transcend seasons and trends.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;