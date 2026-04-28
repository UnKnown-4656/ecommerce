import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ImageComponent from '../components/ImageComponent';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-3xl mb-4">Your Cart</h1>
        <p className="text-muted mb-8">Your cart is empty</p>
        <Link to="/shop" className="btn bg-accent hover:bg-accent-hover text-white inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 p-4 bg-surface border border-border">
                <ImageComponent
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-display text-lg">{item.name}</h3>
                  {item.size && <p className="text-muted text-sm">Size: {item.size}</p>}
                  <p className="font-mono text-accent mt-2">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-8 h-8 border border-border rounded hover:bg-border"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-8 h-8 border border-border rounded hover:bg-border"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-muted hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 21m0 0h6m6 0v-6m0 6h6" />
                    </svg>
                  </button>
                  <p className="font-mono text-accent font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border p-6 sticky top-24">
            <h2 className="font-display text-xl mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-display text-lg">Total</span>
                <span className="font-mono text-accent text-lg">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn bg-accent hover:bg-accent-hover text-white w-full text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;