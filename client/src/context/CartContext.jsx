import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1, size = null) => {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);

    if (product.stock === 0) {
      showToast('Product is out of stock', 'error');
      return;
    }

    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        showToast(`Only ${product.stock} available in stock`, 'error');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      if (quantity > product.stock) {
        showToast(`Only ${product.stock} available in stock`, 'error');
        return;
      }
      setCart([...cart, { ...product, quantity, size }]);
    }
    showToast('Added to cart', 'success');
  };

  const removeFromCart = (id, size) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item && quantity > item.stock) {
      showToast(`Only ${item.stock} available in stock`, 'error');
      return;
    }
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart(cart.map(item =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      toast,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};