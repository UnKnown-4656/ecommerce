import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)',
              zIndex: 999
            }}
          />

          {/* Cart sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            style={{
              position: 'fixed', top: 0, right: 0,
              width: '420px', height: '100vh',
              background: '#0f0f0f',
              borderLeft: '1px solid #1a1a1a',
              zIndex: 1000, padding: '2rem',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: '2rem', fontWeight: 300,
                color: '#e8e0d4'
              }}>
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none', border: 'none',
                  color: '#666', cursor: 'none',
                  padding: '8px'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem' }}>
              {cart.length === 0 ? (
                <p style={{
                  textAlign: 'center', color: '#666',
                  padding: '3rem 0', fontFamily: 'Inter',
                  fontSize: '14px'
                }}>Your cart is empty</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${index}`} style={{
                      display: 'flex', gap: '1rem',
                      borderBottom: '1px solid #1a1a1a',
                      paddingBottom: '1.5rem'
                    }}>
                      <img
                        src={item.image_url?.startsWith('http') ? item.image_url : `https://ecommerce-ahmv.onrender.com${item.image_url}`}
                        alt={item.name}
                        style={{
                          width: '60px', height: '72px',
                          objectFit: 'cover',
                          background: '#111'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/60x72/111/1e1e1e?text=NOIR';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontFamily: 'Cormorant Garamond',
                          fontSize: '1rem', fontWeight: 400,
                          color: '#e0d8cc', marginBottom: '4px'
                        }}>{item.name}</h3>
                        {item.size && (
                          <p style={{
                            fontFamily: 'Inter', fontSize: '11px',
                            color: '#666', marginBottom: '4px'
                          }}>Size: {item.size}</p>
                        )}
                        <p style={{
                          fontFamily: 'Courier New', fontSize: '13px',
                          color: '#b8922e', marginBottom: '8px'
                        }}>${item.price.toFixed(2)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            style={{
                              width: '24px', height: '24px',
                              border: '1px solid #1a1a1a',
                              background: 'transparent',
                              color: '#e8e0d4', cursor: 'none'
                            }}
                          >-</button>
                          <span style={{
                            fontFamily: 'Inter', fontSize: '12px',
                            color: '#e8e0d4', width: '20px',
                            textAlign: 'center'
                          }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            style={{
                              width: '24px', height: '24px',
                              border: '1px solid #1a1a1a',
                              background: 'transparent',
                              color: '#e8e0d4', cursor: 'none'
                            }}
                          >+</button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#666', cursor: 'none',
                          padding: '4px'
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 21m0 0h6m6 0v-6m0 6h6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{
                  fontFamily: 'Cormorant Garamond',
                  fontSize: '1.25rem', fontWeight: 300,
                  color: '#e8e0d4'
                }}>Total</span>
                <span style={{
                  fontFamily: 'Courier New', fontSize: '16px',
                  color: '#b8922e'
                }}>${cartTotal.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                style={{
                  display: 'block', width: '100%',
                  background: '#b8922e', color: '#0a0a0a',
                  fontFamily: 'Inter', fontSize: '11px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '16px', textAlign: 'center',
                  textDecoration: 'none', transition: 'background 0.3s'
                }}
                onMouseEnter={e => e.target.style.background='#d4aa50'}
                onMouseLeave={e => e.target.style.background='#b8922e'}
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;