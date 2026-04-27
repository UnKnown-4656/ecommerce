import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `https://ecommerce-ahmv.onrender.com${product.image_url}`;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      className="product-card group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-surface">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-surface animate-pulse" />
          )}

          <motion.img
            src={imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-[filter] duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            loading="lazy"
            decoding="async"
            width="400"
            height="533"
            onError={e => {
              e.target.src = 'https://placehold.co/400x533/0f0f0f/1e1e1e?text=NOIR';
              setImageLoaded(true);
            }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay elements */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/90 border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">
                    View Product
                  </span>
                </motion.div>

                {product.stock > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleQuickAdd}
                    className="mt-4 font-sans text-[9px] tracking-[0.4em] uppercase text-accent border border-accent/30 bg-bg/80 px-8 py-3 hover:bg-accent hover:text-bg transition-all duration-300"
                  >
                    Quick Add +
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Badges */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
            {product.is_new && (
              <div className="bg-accent/90 text-bg font-sans text-[8px] tracking-[0.3em] uppercase font-bold px-3 py-1.5 shadow-lg">
                New
              </div>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="bg-white/90 text-black font-sans text-[8px] tracking-[0.3em] uppercase font-bold px-3 py-1.5 shadow-lg">
                Limited
              </div>
            )}
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/60 backdrop-blur-sm">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted font-bold border border-muted/30 px-6 py-2">
                Sold Out
              </span>
            </div>
          )}

          {/* Animated line at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-accent z-20"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="pt-6 pb-2 relative flex flex-col items-center text-center">
          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/60 mb-3">
            {product.category}
          </p>

          <h3 className="font-display text-lg text-text mb-2 leading-tight tracking-wide group-hover:text-accent transition-colors duration-500">
            {product.name}
          </h3>

          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-accent tracking-widest">
              ${product.price?.toFixed(2)}
            </span>
            {product.old_price && (
              <span className="font-mono text-[11px] text-muted line-through opacity-50">
                ${product.old_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;