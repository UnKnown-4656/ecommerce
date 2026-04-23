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
      transition={{ duration: 0.7, delay: index * 0.08 }}
      style={{ cursor: 'none' }}
    >
      <Link to={`/product/${product.id}`}>
        
        {/* Image container */}
        <div style={{ 
          position: 'relative', overflow: 'hidden',
          aspectRatio: '3/4', background: '#111'
        }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="card-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.src='https://placehold.co/400x533/111/1e1e1e?text=NOIR'}
          />

          {/* Hover overlay */}
          <div className="card-overlay" style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'Inter', fontSize: '10px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'white', border: '1px solid rgba(255,255,255,0.5)',
              padding: '10px 24px'
            }}>Quick View</span>
          </div>

          {/* NEW badge */}
          {product.is_new && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#b8922e', color: '#0a0a0a',
              fontFamily: 'Inter', fontSize: '9px',
              fontWeight: 600, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '4px 10px'
            }}>New</div>
          )}

          {/* SOLD OUT badge */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#1a1a1a', color: '#555',
              fontFamily: 'Inter', fontSize: '9px',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '4px 10px'
            }}>Sold Out</div>
          )}
        </div>

        {/* Product info */}
        <div style={{ paddingTop: '16px' }}>
          <p style={{
            fontFamily: 'Inter', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#444', marginBottom: '6px'
          }}>{product.category}</p>

          <h3 style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: '1.25rem', fontWeight: 400,
            color: '#e0d8cc', marginBottom: '6px',
            transition: 'color 0.3s'
          }}
          onMouseEnter={e => e.target.style.color='#b8922e'}
          onMouseLeave={e => e.target.style.color='#e0d8cc'}
          >{product.name}</h3>

          <p style={{
            fontFamily: 'Courier New', fontSize: '13px',
            color: '#b8922e', marginBottom: '6px'
          }}>${product.price?.toFixed(2)}</p>

          {/* Star rating */}
          {product.avg_rating && (
            <p style={{
              fontFamily: 'Inter', fontSize: '11px', color: '#555'
            }}>
              {'★'.repeat(Math.round(product.avg_rating))}
              {'☆'.repeat(5 - Math.round(product.avg_rating))}
              {' '}
              <span style={{ color: '#3a3a3a' }}>
                ({product.review_count})
              </span>
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;