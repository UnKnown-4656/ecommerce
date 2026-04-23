import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

        const allProducts = await api.get('/products');
        const related = allProducts.data
          .filter(p => p.category === response.data.category && p.id !== response.data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }
    addToCart(product, quantity, selectedSize || null);
    navigate('/cart');
  };

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  const sizes = product?.sizes ? JSON.parse(product.sizes) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-display text-2xl italic text-muted">Product not found</p>
      </div>
    );
  }

  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `https://ecommerce-ahmv.onrender.com${product.image_url}`;

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-container mx-auto px-6 md:px-12 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="sticky top-32"
            >
              <div className="aspect-[3/4] bg-surface overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x800/111/1e1e1e?text=NOIR';
                  }}
                />
              </div>
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-text">
                    Sold Out
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:py-12"
          >
            <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted mb-4">
              {product.category}
            </p>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-text mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="h-px w-10 bg-accent mb-8" />

            <p className="font-mono text-2xl text-accent tracking-wider mb-8">
              ${product.price?.toFixed(2)}
            </p>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="font-sans text-xs tracking-wider text-accent mb-6">
                Only {product.stock} left in stock
              </p>
            )}

            <p className="font-sans text-muted leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            <div className="h-px w-full bg-border mb-10" />

            {sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted">
                    Size
                  </p>
                  <button className="font-sans text-[10px] tracking-wider text-accent hover:text-accent-hover transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-3 border text-sm font-sans tracking-wider transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-bg'
                          : 'border-border text-text hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-10">
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted mb-4">
                Quantity
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-text transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-sans text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-text transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`btn-primary flex-1 justify-center ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            <div className="flex items-center gap-8 py-6 border-t border-b border-border">
              <div className="flex items-center gap-2 text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-sans text-xs tracking-wider">Free Returns</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="font-sans text-xs tracking-wider">Free Exchanges</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-16 border-t border-border"
        >
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl text-text mb-8">
              Customer Reviews
            </h2>
            <div className="h-px w-10 bg-accent mb-12" />
            <ReviewsList productId={id} refreshTrigger={refreshReviews} />
          </div>
        </motion.div>

        <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />

        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-24 border-t border-border"
          >
            <div className="mb-12">
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted mb-4">
                You May Also Like
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-text">
                Related Pieces
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;