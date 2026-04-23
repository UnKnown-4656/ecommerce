import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { calculateAverageRating } from '../utils/reviews';

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  
  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `https://ecommerce-ahmv.onrender.com${product.image_url}`;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
          setAverageRating(calculateAverageRating(data));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [product.id]);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="product-card card">
        <div className="aspect-[3/4] relative overflow-hidden bg-surface">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x400?text=No+Image';
            }}
          />
          <div className="overlay">
            <span className="text-white text-xs tracking-[0.15em] uppercase">Quick View</span>
          </div>
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-[#333] text-white text-[0.65rem] tracking-wider uppercase">
              Sold Out
            </div>
          )}
        </div>
        <div className="py-4">
          <p className="text-[0.7rem] uppercase tracking-widest text-muted mb-1">{product.category}</p>
          <h3 className="font-display text-base mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
          
          {averageRating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={averageRating} size="w-4 h-4" />
              <span className="text-xs text-muted">
                {averageRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
          
          <p className="font-mono text-accent text-lg font-medium">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;