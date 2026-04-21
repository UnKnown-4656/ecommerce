import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl">Your Cart ({cartCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded hover:bg-border"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-center text-muted py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 border-b border-border pb-4">
                  <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.name}
                    className="w-20 h-24 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x96?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.size && <p className="text-muted text-xs">Size: {item.size}</p>}
                    <p className="font-mono text-accent text-sm mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 border border-border rounded hover:bg-border"
                      >
                        -
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 border border-border rounded hover:bg-border"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-muted hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 21m0 0h6m6 0v-6m0 6h6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex justify-between mb-4">
            <span className="font-display text-lg">Total</span>
            <span className="font-mono text-accent text-lg">${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={() => setIsCartOpen(false)}
            className="block w-full bg-accent hover:bg-accent-hover text-white text-center py-3 uppercase tracking-wider"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;