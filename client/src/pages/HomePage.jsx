import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
      <section className="relative h-screen flex items-center justify-center bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg z-10" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        </div>
        <div className="relative z-20 text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 tracking-tight">
            Dress With Intent
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Timeless pieces crafted for those who understand that style is a statement, not just a choice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="btn bg-accent hover:bg-accent-hover text-white inline-block"
            >
              Shop Collection
            </Link>
            <Link
              to="/shop?category=Outerwear"
              className="btn border border-accent text-accent hover:bg-accent hover:text-white inline-block"
            >
              Explore Outerwear
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12">Featured Pieces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="btn border border-border hover:border-accent inline-block"
          >
            View All
          </Link>
        </div>
      </section>

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