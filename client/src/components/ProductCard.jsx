import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index = 0 }) => {
  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `https://ecommerce-ahmv.onrender.com${product.image_url}`;

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '3/4',
          background: '#0f0f0f',
        }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="card-image"
            onError={e => {
              e.target.src = 'https://placehold.co/400x533/0f0f0f/1e1e1e?text=NOIR';
            }}
          />

          {/* Overlay */}
          <div className="card-overlay" style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 24px',
            }}>Quick View</span>
          </div>

          {/* Badges */}
          {product.is_new && (
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              background: '#b8922e', color: '#0a0a0a',
              fontFamily: 'Inter, sans-serif',
              fontSize: '8px', fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 12px',
            }}>New</div>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              background: 'rgba(10,10,10,0.8)',
              color: '#444',
              fontFamily: 'Inter, sans-serif',
              fontSize: '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 12px',
              border: '1px solid #1e1e1e',
            }}>Sold Out</div>
          )}
        </div>

        {/* Info */}
        <div style={{ paddingTop: '18px', paddingBottom: '4px', position: 'relative' }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#333',
            marginBottom: '8px',
          }}>{product.category}</p>

          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#e0d8cc',
            marginBottom: '8px',
            lineHeight: 1.2,
            transition: 'color 0.3s',
          }}>{product.name}</h3>

          <p style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#b8922e',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>${product.price?.toFixed(2)}</p>

          {/* Stars */}
          {product.avg_rating > 0 && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#444',
              letterSpacing: '0.05em',
            }}>
              <span style={{ color: '#b8922e' }}>
                {'★'.repeat(Math.round(product.avg_rating))}
                {'☆'.repeat(5 - Math.round(product.avg_rating))}
              </span>
              {' '}
              <span style={{ color: '#2a2a2a' }}>
                ({product.review_count || 0})
              </span>
            </p>
          )}

          {/* Gold slide line */}
          <div className="gold-line" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;