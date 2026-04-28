import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ImageComponent from './ImageComponent';

const CartDrawer = ({ isOpen }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <div>
                <h2 className="font-display text-2xl text-text">Your Cart</h2>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted mt-1">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted hover:text-text transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-12 h-12 text-muted mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-display text-xl text-text mb-2">Your cart is empty</p>
                  <p className="font-sans text-sm text-muted mb-8">Add pieces to begin your journey.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-5 pb-6 border-b border-border last:border-0"
                    >
                      <div className="w-20 h-24 bg-surface overflow-hidden flex-shrink-0">
                        <ImageComponent
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg text-text truncate">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="font-mono text-sm text-accent mt-2">
                          ${item.price?.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted hover:text-text transition-colors text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center font-sans text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted hover:text-text transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-muted hover:text-accent transition-colors duration-300 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 21m0 0h6m6 0v-6m0 6h6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-xl text-text">Total</span>
                  <span className="font-mono text-xl text-accent">${cartTotal?.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted mb-4">
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;