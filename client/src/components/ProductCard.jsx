import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-surface border border-border">
        <div className="aspect-3-4 relative">
          <img
            src={`http://localhost:5000${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium uppercase tracking-wider">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
          <p className="text-muted text-sm mb-2">{product.category}</p>
          <p className="font-mono text-accent font-medium">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;