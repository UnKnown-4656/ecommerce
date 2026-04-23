import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index = 0 }) => {
  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `https://ecommerce-ahmv.onrender.com${product.image_url}`;

  return (
    <motion.div
      className="product-card group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="block"
      >
        <div className="relative overflow-hidden aspect-[3/4] bg-surface">
          <img
            src={imageUrl}
            alt={product.name}
            className="card-image w-full h-full object-cover"
            onError={e => {
              e.target.src = 'https://placehold.co/400x533/111/1e1e1e?text=NOIR';
            }}
          />

          <div className="card-overlay absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center">
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/90 border border-white/30 px-6 py-3">
              View Details
            </span>
          </div>

          {product.is_new && (
            <div className="absolute top-4 left-4 bg-accent text-bg font-sans text-[8px] tracking-[0.2em] uppercase font-medium px-3 py-1.5">
              New
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-bg/80 text-muted font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-1.5 border border-border">
              Sold Out
            </div>
          )}

          <div className="gold-line absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-accent to-transparent transition-all duration-500" />
        </div>

        <div className="pt-5 pb-2 relative">
          <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-muted mb-2">
            {product.category}
          </p>

          <h3 className="font-display text-xl text-text mb-2 leading-tight group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>

          <p className="font-mono text-sm text-accent tracking-wider">
            ${product.price?.toFixed(2)}
          </p>

          {product.avg_rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.round(product.avg_rating) ? 'text-accent' : 'text-border'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted">
                ({product.review_count || 0})
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;