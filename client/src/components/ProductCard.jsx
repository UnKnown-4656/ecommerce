import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: 1000 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-surface border border-border">
          <div className="aspect-3-4 relative overflow-hidden">
            <motion.img
              src={`http://localhost:5000${product.image_url}`}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium uppercase tracking-wider">Out of Stock</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
            <p className="text-muted text-sm mb-2">{product.category}</p>
            <motion.p 
              className="font-mono text-accent font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ${product.price.toFixed(2)}
            </motion.p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;